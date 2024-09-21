import React from "react";
import { Play, Square, SkipForward } from "lucide-react";

const Controls = ({
  onStart,
  onStop,
  isRunning,
  onIteration,
  canIterate,
  currentStep,
  totalSteps,
  theme,
}) => {
  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg ${
        theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-white text-gray-900"
      }`}
    >
      <div className="flex space-x-2">
        <button
          onClick={isRunning ? onStop : onStart}
          className={`px-4 py-2 rounded-md ${
            isRunning
              ? theme === "dark"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-red-500 hover:bg-red-600"
              : theme === "dark"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-500 hover:bg-green-600"
          } text-white transition-colors duration-200 flex items-center`}
        >
          {isRunning ? (
            <>
              <Square className="w-5 h-5 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Start
            </>
          )}
        </button>
        <button
          onClick={onIteration}
          disabled={!canIterate}
          className={`px-4 py-2 rounded-md ${
            canIterate
              ? theme === "dark"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
              : theme === "dark"
              ? "bg-gray-600"
              : "bg-gray-300"
          } text-white transition-colors duration-200 flex items-center`}
        >
          <SkipForward className="w-5 h-5 mr-2" />
          Next Step
        </button>
      </div>
      <div
        className={`text-sm ${
          theme === "dark" ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Step: {currentStep + 1} / {totalSteps}
      </div>
    </div>
  );
};

export default Controls;
