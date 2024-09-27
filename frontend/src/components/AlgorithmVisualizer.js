import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import CodeEditor from "./CodeEditor";
import Visualizer from "./Visualizer";
import TreeVisualizer from "./TreeVisualizer";
import Controls from "./Controls";
import InputSelector from "./InputSelector";
import { useTheme } from "../contexts/ThemeContext";

export default function AlgorithmVisualizer({
  code,
  onCodeChange,
  visualizationData,
  isRunning,
  isPlaying,
  onStart,
  onStop,
  onPlayPause,
  onStepForward,
  onStepBackward,
  selectedAlgorithm,
  currentStep,
  setCurrentStep,
}) {
  const [editorHeight, setEditorHeight] = useState("auto");
  const [inputData, setInputData] = useState([]);
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
    (selectedData) => {
      setInputData(selectedData);

      // Preserve the generic code and append the dynamic input data
      const genericCode = code.split("\n\n")[0]; // Assuming the generic code is the first block
      const isTreeAlgorithm = selectedAlgorithm.toLowerCase().includes("tree");
      const variableName = isTreeAlgorithm ? "tree" : "arr";
      const updatedCode = `${genericCode}\n\n${variableName} = ${JSON.stringify(
        selectedData
      )}`;

      onCodeChange(updatedCode);
    },
    [code, onCodeChange, selectedAlgorithm]
  );

  const handleStart = useCallback(() => {
    console.log(
      "Starting algorithm:",
      selectedAlgorithm,
      "with input:",
      inputData
    );
    onStart(selectedAlgorithm, inputData);
  }, [onStart, selectedAlgorithm, inputData]);

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
            onPlayPause();
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
    onPlayPause,
  ]);

  const canPlay = visualizationData && visualizationData.length > 0;

  const isTreeAlgorithm = selectedAlgorithm.toLowerCase().includes("tree");

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
            <InputSelector
              onInputSelect={handleInputSelect}
              theme={theme}
              isTreeInput={isTreeAlgorithm}
            />
          </div>
        </div>
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div
            className={`flex-grow ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            } rounded-lg overflow-hidden`}
            style={{ height: editorHeight }}
          >
            {isTreeAlgorithm ? (
              <TreeVisualizer
                data={visualizationData || []}
                currentStep={currentStep}
              />
            ) : (
              <Visualizer
                data={visualizationData || []}
                theme={theme}
                currentStep={currentStep}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 flex flex-col items-center">
        <Controls
          onStart={handleStart}
          onStop={onStop}
          onPlayPause={onPlayPause}
          onStepForward={onStepForward}
          onStepBackward={onStepBackward}
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
          <label htmlFor="playbackSpeed" className="mr-4 text-sm font-medium">
            Playback Speed:
          </label>
          <input
            id="playbackSpeed"
            type="range"
            min="100"
            max="1000"
            step="100"
            value={1100 - playbackSpeed}
            onChange={handleSpeedChange}
            className="w-64"
            aria-valuemin="100"
            aria-valuemax="1000"
            aria-valuenow={1100 - playbackSpeed}
          />
          <span className="ml-4 text-sm">{playbackSpeed}ms</span>
        </div>
      </div>
    </div>
  );
}

AlgorithmVisualizer.propTypes = {
  code: PropTypes.string.isRequired,
  onCodeChange: PropTypes.func.isRequired,
  visualizationData: PropTypes.array,
  isRunning: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  onStepForward: PropTypes.func.isRequired,
  onStepBackward: PropTypes.func.isRequired,
  selectedAlgorithm: PropTypes.string.isRequired,
  currentStep: PropTypes.number.isRequired,
  setCurrentStep: PropTypes.func.isRequired,
};
