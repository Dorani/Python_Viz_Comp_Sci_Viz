import React from "react";

const Controls = ({
  onStart,
  onStop,
  onPlayPause,
  onStepForward,
  onStepBackward,
  isRunning,
  isPlaying,
  canPlay,
  canStepForward,
  canStepBackward,
  currentStep,
  totalSteps,
  theme,
  onToggleSideView,
  isSideViewOpen,
}) => {
  const buttonClass = `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
    theme === "dark"
      ? "bg-gray-700 text-white hover:bg-gray-600"
      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
  }`;

  const disabledButtonClass = `px-4 py-2 rounded-md text-sm font-medium ${
    theme === "dark" ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-400"
  } cursor-not-allowed`;

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={onStart}
        disabled={isRunning}
        className={isRunning ? disabledButtonClass : buttonClass}
      >
        Start
      </button>
      <button
        onClick={onStop}
        disabled={!isRunning && currentStep === 0}
        className={
          !isRunning && currentStep === 0 ? disabledButtonClass : buttonClass
        }
      >
        ■
      </button>
      <button
        onClick={onPlayPause}
        disabled={!canPlay}
        className={!canPlay ? disabledButtonClass : buttonClass}
      >
        {isPlaying ? "❚❚" : "▶"}
      </button>
      <button
        onClick={onStepBackward}
        disabled={!canStepBackward}
        className={!canStepBackward ? disabledButtonClass : buttonClass}
      >
        ⏮
      </button>
      <button
        onClick={onStepForward}
        disabled={!canStepForward}
        className={!canStepForward ? disabledButtonClass : buttonClass}
      >
        ⏭
      </button>
      <div className="mx-4 text-sm">
        Step: {currentStep + 1} / {totalSteps}
      </div>
      <button onClick={onToggleSideView} className={buttonClass}>
        {isSideViewOpen ? "◀" : "▶"}
      </button>
    </div>
  );
};

export default Controls;
