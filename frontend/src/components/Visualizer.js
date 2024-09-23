import React, { useRef, useEffect, useState, useCallback } from "react";

const Visualizer = ({ data, theme, currentStep }) => {
  const canvasRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState("100%");
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const drawVisualization = useCallback(
    (ctx, width, height) => {
      if (!ctx || width === 0 || height === 0 || !data || !data[currentStep])
        return;

      ctx.clearRect(0, 0, width, height);
      ctx.save();

      const { current_array, comparisons, swapped } = data[currentStep];
      const arrayLength = current_array.length;
      const maxValue = Math.max(...current_array);

      const barWidth = width / arrayLength;
      const scaleFactor = height / maxValue; // Remove the subtraction of 40 to use full height

      // Set background color
      ctx.fillStyle = theme === "dark" ? "#1f2937" : "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Draw grid lines
      ctx.strokeStyle =
        theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)";
      ctx.lineWidth = 1;

      // Vertical grid lines
      for (let i = 0; i <= arrayLength; i++) {
        const x = i * barWidth;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal grid lines
      const horizontalLines = 10;
      for (let i = 0; i <= horizontalLines; i++) {
        const y = (i / horizontalLines) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw bars
      current_array.forEach((value, index) => {
        const x = index * barWidth;
        const y = height - value * scaleFactor;
        const barHeight = value * scaleFactor;

        ctx.fillStyle = theme === "dark" ? "#4a90e2" : "#2c5282";
        if (comparisons && comparisons.includes(index)) {
          ctx.fillStyle = "#ff6b6b";
        }
        if (
          swapped &&
          comparisons &&
          (index === comparisons[0] || index === comparisons[1])
        ) {
          ctx.fillStyle = "#feca57";
        }
        ctx.fillRect(x, y, barWidth - 1, barHeight);

        // Draw value on top of the bar
        ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
        ctx.font = "10px Arial";
        ctx.textAlign = "center";
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      });

      // Draw x-axis labels
      ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      for (let i = 0; i < arrayLength; i++) {
        ctx.fillText(i.toString(), i * barWidth + barWidth / 2, height - 5);
      }

      // Draw y-axis labels
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      for (let i = 0; i <= horizontalLines; i++) {
        const value = Math.round((i / horizontalLines) * maxValue);
        const y = height - (i / horizontalLines) * height;
        ctx.fillText(value.toString(), 15, y);
      }

      ctx.restore();
    },
    [data, currentStep, theme]
  );

  useEffect(() => {
    const updateContainerHeight = () => {
      const windowHeight = window.innerHeight;
      const newHeight = windowHeight * 0.6; // 60% of the window height
      setContainerHeight(`${newHeight}px`);
    };

    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);

    return () => window.removeEventListener("resize", updateContainerHeight);
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect();
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    drawVisualization(ctx, canvasSize.width, canvasSize.height);
  }, [drawVisualization, canvasSize]);

  const currentArray =
    data &&
    data.length > 0 &&
    data[currentStep] &&
    data[currentStep].current_array
      ? data[currentStep].current_array
      : [];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow relative" style={{ height: containerHeight }}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          width={canvasSize.width}
          height={canvasSize.height}
        />
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

export default Visualizer;
