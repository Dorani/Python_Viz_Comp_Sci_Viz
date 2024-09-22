import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  ZoomIn,
  ZoomOut,
  Minimize2,
  Move,
  Grid,
  BarChart2,
} from "lucide-react";

const Visualizer = ({ data, theme, currentStep }) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [isPanMode, setIsPanMode] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [viewType, setViewType] = useState("bars");
  const [containerHeight, setContainerHeight] = useState("100%");

  const drawVisualization = useCallback(
    (ctx, width, height) => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      const textColor = theme === "dark" ? "#ffffff" : "#000000";
      const barColor = theme === "dark" ? "#4a90e2" : "#2c5282";
      const comparisonColor = "#ff6b6b";
      const swappedColor = "#feca57";
      const gridColor =
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";

      if (data && data.length > 0 && data[data.length - 1].current_array) {
        const currentData = data[data.length - 1];
        const { current_array, comparisons, swapped } = currentData;

        const arrayLength = current_array.length;
        const maxValue = Math.max(...current_array);

        // Draw grid
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= arrayLength; i++) {
          const x = (i / arrayLength) * width;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let i = 0; i <= 10; i++) {
          const y = (i / 10) * height;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        if (viewType === "bars") {
          const barWidth = Math.max(1, width / arrayLength / zoom);
          const scaleFactor = height / maxValue / zoom;

          current_array.forEach((value, index) => {
            const x = index * (width / arrayLength);
            const y = height - value * scaleFactor;
            const barHeight = value * scaleFactor;

            ctx.fillStyle = barColor;
            if (comparisons && comparisons.includes(index)) {
              ctx.fillStyle = comparisonColor;
            }
            if (
              swapped &&
              comparisons &&
              (index === comparisons[0] || index === comparisons[1])
            ) {
              ctx.fillStyle = swappedColor;
            }
            ctx.fillRect(x, y, barWidth, barHeight);

            if (zoom > 0.5 && barWidth > 20) {
              ctx.fillStyle = textColor;
              ctx.font = `${12 / zoom}px Arial`;
              ctx.textAlign = "center";
              ctx.fillText(value.toString(), x + barWidth / 2, y - 5 / zoom);
            }
          });
        } else if (viewType === "minimap") {
          const cellSize =
            Math.min(width, height) / Math.ceil(Math.sqrt(arrayLength)) / zoom;
          const cols = Math.floor(width / cellSize);

          current_array.forEach((value, index) => {
            const x = (index % cols) * cellSize;
            const y = Math.floor(index / cols) * cellSize;

            ctx.fillStyle = barColor;
            if (comparisons && comparisons.includes(index)) {
              ctx.fillStyle = comparisonColor;
            }
            if (
              swapped &&
              comparisons &&
              (index === comparisons[0] || index === comparisons[1])
            ) {
              ctx.fillStyle = swappedColor;
            }
            ctx.fillRect(x, y, cellSize - 1, cellSize - 1);

            if (zoom > 0.5 && cellSize > 20) {
              ctx.fillStyle = textColor;
              ctx.font = `${10 / zoom}px Arial`;
              ctx.textAlign = "center";
              ctx.fillText(
                value.toString(),
                x + cellSize / 2,
                y + cellSize / 2 + 3 / zoom
              );
            }
          });
        }

        // Draw axes
        ctx.strokeStyle = textColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, height);
        ctx.lineTo(width, height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, height);
        ctx.stroke();

        // Draw axis labels
        ctx.fillStyle = textColor;
        ctx.font = "14px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Array Index", width / 2, height + 20);
        ctx.save();
        ctx.rotate(-Math.PI / 2);
        ctx.fillText("Value", -height / 2, -20);
        ctx.restore();
      } else {
        ctx.fillStyle = textColor;
        ctx.font = "16px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
          "No data available. Start the algorithm to visualize.",
          width / 2,
          height / 2
        );
      }

      ctx.restore();
    },
    [data, theme, zoom, pan, viewType]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      drawVisualization(ctx, width, height);
    });

    resizeObserver.observe(canvas);

    return () => resizeObserver.disconnect();
  }, [drawVisualization]);

  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight * 0.7; // 70% of the window height
      setContainerHeight(`${newHeight}px`);
    };

    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);

    return () => window.removeEventListener("resize", updateContainerHeight);
  }, []);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.1));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };
  const togglePanMode = () => setIsPanMode(!isPanMode);
  const toggleViewType = () =>
    setViewType((prev) => (prev === "bars" ? "minimap" : "bars"));

  const handleMouseMove = (e) => {
    if (isPanMode) {
      setPan((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
    }
  };

  const currentArray =
    data && data.length > 0 && data[data.length - 1].current_array
      ? data[data.length - 1].current_array
      : [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow relative" style={{ height: containerHeight }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseMove={handleMouseMove}
          style={{ cursor: isPanMode ? "move" : "default" }}
        />
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-opacity-90 bg-gray-800 dark:bg-gray-200 p-2 rounded-lg shadow-lg">
          <ControlButton
            onClick={handleZoomIn}
            icon={<ZoomIn size={18} />}
            tooltip="Zoom In"
            theme={theme}
          />
          <ControlButton
            onClick={handleZoomOut}
            icon={<ZoomOut size={18} />}
            tooltip="Zoom Out"
            theme={theme}
          />
          <ControlButton
            onClick={handleResetZoom}
            icon={<Minimize2 size={18} />}
            tooltip="Reset Zoom"
            theme={theme}
          />
          <ControlButton
            onClick={togglePanMode}
            icon={<Move size={18} />}
            tooltip="Toggle Pan Mode"
            isActive={isPanMode}
            theme={theme}
          />
          <ControlButton
            onClick={toggleViewType}
            icon={
              viewType === "bars" ? <Grid size={18} /> : <BarChart2 size={18} />
            }
            tooltip={
              viewType === "bars" ? "Switch to Grid View" : "Switch to Bar View"
            }
            theme={theme}
          />
        </div>
      </div>
      <div
        className={`p-4 ${
          theme === "dark" ? "bg-gray-700" : "bg-gray-200"
        } overflow-hidden`}
      >
        <h3
          className={`text-lg font-semibold mb-2 ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Current Array State{" "}
          {currentStep >= 0 ? `(Step ${currentStep + 1})` : ""}
        </h3>
        {currentArray.length > 0 ? (
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {currentArray.map((value, index) => (
              <div
                key={index}
                className={`px-2 py-1 text-xs rounded ${
                  theme === "dark"
                    ? "bg-gray-600 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {`${index}:${value}`}
              </div>
            ))}
          </div>
        ) : (
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            No array data available. Start the algorithm to see the current
            state.
          </p>
        )}
      </div>
    </div>
  );
};

const ControlButton = ({ onClick, icon, tooltip, isActive = false, theme }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-md transition-colors duration-200 ${
        isActive
          ? "bg-blue-500 text-white"
          : theme === "dark"
          ? "bg-gray-700 text-white hover:bg-gray-600"
          : "bg-gray-300 text-gray-800 hover:bg-gray-400"
      }`}
      title={tooltip}
    >
      {icon}
    </button>
  );
};

export default Visualizer;
