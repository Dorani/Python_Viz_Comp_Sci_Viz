import React, { useState, useEffect, useCallback } from "react";
import CodeEditor from "./CodeEditor";
import Visualizer from "./Visualizer";
import Controls from "./Controls";
import InputSelector from "./InputSelector";
import { useTheme } from "../contexts/ThemeContext";

export default function AlgorithmVisualizer({
  code,
  onCodeChange,
  visualizationData,
  isRunning,
  onStart,
  onStop,
  selectedAlgorithm,
  currentStep,
  setCurrentStep,
}) {
  const [editorHeight, setEditorHeight] = useState("auto");
  const [inputArray, setInputArray] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(500); // Default speed: 500ms
  const { theme } = useTheme();
  const containerRef = React.useRef(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        const newHeight = Math.max(300, containerHeight - 350);
        setEditorHeight(`${newHeight}px`);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    console.log("Visualization data updated:", visualizationData);
    if (!visualizationData) {
      console.warn(
        "Visualization data is undefined for algorithm:",
        selectedAlgorithm
      );
    }
  }, [visualizationData, selectedAlgorithm]);

  const handleInputSelect = useCallback(
    (selectedArray) => {
      setInputArray(selectedArray);

      // Preserve the generic code and append the dynamic array
      const genericCode = code.split("\n\n")[0]; // Assuming the generic code is the first block
      const updatedCode = `${genericCode}\n\narr = ${JSON.stringify(
        selectedArray
      )}`;

      onCodeChange(updatedCode);
    },
    [code, onCodeChange]
  );

  const handleStart = useCallback(() => {
    console.log(
      "Starting algorithm:",
      selectedAlgorithm,
      "with input:",
      inputArray
    );
    onStart(selectedAlgorithm, inputArray);
  }, [onStart, selectedAlgorithm, inputArray]);

  const handleStop = useCallback(() => {
    console.log("Stopping algorithm");
    onStop();
    setIsPlaying(false);
    setCurrentStep(0);
  }, [onStop, setCurrentStep]);

  const handlePlayPause = useCallback(() => {
    console.log("Play/Pause toggled. Current isPlaying:", isPlaying);
    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  const handleStepForward = useCallback(() => {
    console.log("Stepping forward. Current step:", currentStep);
    if (visualizationData && currentStep < visualizationData.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, visualizationData, setCurrentStep]);

  const handleStepBackward = useCallback(() => {
    console.log("Stepping backward. Current step:", currentStep);
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep, setCurrentStep]);

  const handleSpeedChange = useCallback((event) => {
    const newSpeed = 1100 - parseInt(event.target.value, 10);
    console.log("Speed changed to:", newSpeed);
    setPlaybackSpeed(newSpeed);
  }, []);

  useEffect(() => {
    let intervalId;
    if (
      isPlaying &&
      visualizationData &&
      currentStep < visualizationData.length - 1
    ) {
      console.log(
        "Auto-playing. Current step:",
        currentStep,
        "Total steps:",
        visualizationData.length
      );
      intervalId = setInterval(() => {
        setCurrentStep((prev) => {
          if (visualizationData && prev < visualizationData.length - 1) {
            console.log("Auto-stepping to:", prev + 1);
            return prev + 1;
          } else {
            console.log(
              "Reached end of visualization or no data. Stopping playback."
            );
            setIsPlaying(false);
            return prev;
          }
        });
      }, playbackSpeed);
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [
    isPlaying,
    currentStep,
    visualizationData,
    setCurrentStep,
    playbackSpeed,
  ]);

  const canPlay = visualizationData && visualizationData.length > 0;

  console.log(
    "Render - isRunning:",
    isRunning,
    "isPlaying:",
    isPlaying,
    "currentStep:",
    currentStep,
    "visualizationData length:",
    visualizationData ? visualizationData.length : "N/A",
    "canPlay:",
    canPlay
  );

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
          <div className="mt-4 overflow-y-auto" style={{ height: "200px" }}>
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
              data={visualizationData || []}
              theme={theme}
              currentStep={currentStep}
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <Controls
          onStart={handleStart}
          onStop={handleStop}
          onPlayPause={handlePlayPause}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          isRunning={isRunning}
          isPlaying={isPlaying}
          canPlay={canPlay}
          canStepForward={
            visualizationData && currentStep < visualizationData.length - 1
          }
          canStepBackward={currentStep > 0}
          currentStep={currentStep}
          totalSteps={visualizationData ? visualizationData.length : 0}
          theme={theme}
        />
        <div className="mt-4 flex items-center">
          <span className="mr-4 text-sm font-medium">Playback Speed:</span>
          <input
            type="range"
            min="100"
            max="1000"
            step="100"
            value={1100 - playbackSpeed}
            onChange={handleSpeedChange}
            className="w-64"
          />
          <span className="ml-4 text-sm">{playbackSpeed}ms</span>
        </div>
      </div>
    </div>
  );
}
