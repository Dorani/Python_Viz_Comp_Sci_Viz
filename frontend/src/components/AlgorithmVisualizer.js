import React, { useState, useEffect } from "react";
import CodeEditor from "./CodeEditor";
import Visualizer from "./Visualizer";
import Controls from "./Controls";
import InputSelector from "./InputSelector";
import { useTheme } from "../contexts/ThemeContext";
import { socket } from "../socket";

export default function AlgorithmVisualizer({
  code,
  onCodeChange,
  selectedAlgorithm,
}) {
  const [editorHeight, setEditorHeight] = useState("auto");
  const [currentStep, setCurrentStep] = useState(0);
  const [inputArray, setInputArray] = useState([]);
  const [visualizationData, setVisualizationData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const { theme } = useTheme();
  const containerRef = React.useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const newHeight = Math.max(300, containerHeight - 250);
        setEditorHeight(`${newHeight}px`);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    if (visualizationData.length > 0) {
      setCurrentStep(0);
    } else {
      setCurrentStep(-1);
    }
  }, [visualizationData]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("algorithm_step", (step) => {
      console.log("Received algorithm step:", step);
      setVisualizationData((prevData) => [...prevData, step]);
    });

    socket.on("algorithm_complete", () => {
      console.log("Algorithm completed");
      setIsRunning(false);
    });

    socket.on("error", (error) => {
      console.error("Algorithm error:", error);
      setIsRunning(false);
    });

    return () => {
      socket.off("algorithm_step");
      socket.off("algorithm_complete");
      socket.off("error");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const handleIteration = () => {
    if (currentStep < visualizationData.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const canIterate =
    visualizationData.length > 0 && currentStep < visualizationData.length - 1;

  const handleInputSelect = (selectedArray) => {
    setInputArray(selectedArray);
    const updatedCode = `arr = ${JSON.stringify(selectedArray)}\n\n${code
      .split("\n\n")
      .slice(1)
      .join("\n\n")}`;
    onCodeChange(updatedCode);
  };

  const handleStart = () => {
    console.log("Starting algorithm:", selectedAlgorithm, inputArray);
    setIsRunning(true);
    setVisualizationData([]);
    socket.emit("execute_algorithm", {
      name: selectedAlgorithm,
      input: inputArray,
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    socket.emit("stop_algorithm");
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full p-4 overflow-hidden"
    >
      <div className="flex flex-1 gap-4 mb-4 overflow-hidden">
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div
            className={`flex-grow ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-lg overflow-hidden`}
            style={{ height: editorHeight }}
          >
            <CodeEditor
              code={code}
              onChange={onCodeChange}
              height={editorHeight}
              theme={theme}
            />
          </div>
          <div className="mt-4 overflow-y-auto" style={{ maxHeight: "150px" }}>
            <InputSelector onInputSelect={handleInputSelect} theme={theme} />
          </div>
        </div>
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div
            className={`flex-grow ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-lg overflow-hidden`}
            style={{ height: editorHeight }}
          >
            <Visualizer
              data={visualizationData.slice(0, currentStep + 1)}
              theme={theme}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <Controls
          onStart={handleStart}
          onStop={handleStop}
          isRunning={isRunning}
          onIteration={handleIteration}
          canIterate={canIterate}
          currentStep={currentStep}
          totalSteps={visualizationData.length}
          theme={theme}
        />
      </div>
    </div>
  );
}
