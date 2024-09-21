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
  const resizeTimeoutRef = useRef(null);

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

      if (data && data.length > 0 && data[data.length - 1].current_array) {
        const currentData = data[data.length - 1];
        const { current_array, comparisons, swapped } = currentData;

        const arrayLength = current_array.length;
        const maxValue = Math.max(...current_array);

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

  const handleResize = useCallback(
    (width, height) => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        drawVisualization(ctx, width, height);
      }
    },
    [drawVisualization]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          handleResize(width, height);
        }
      }, 100); // Debounce resize events
    });

    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [handleResize]);

  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight * 0.7; // 70% of the window height
      setContainerHeight(`${newHeight}px`);
    };

    const debouncedUpdateContainerHeight = debounce(updateContainerHeight, 100);

    updateContainerHeight();
    window.addEventListener("resize", debouncedUpdateContainerHeight);

    return () =>
      window.removeEventListener("resize", debouncedUpdateContainerHeight);
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

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default Visualizer;
