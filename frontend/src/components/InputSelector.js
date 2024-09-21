import React, { useState } from "react";

export default function InputSelector({ onInputSelect, theme }) {
  const [inputType, setInputType] = useState("manual");
  const [manualInput, setManualInput] = useState("");
  const [arraySize, setArraySize] = useState(10);
  const [minValue, setMinValue] = useState(1);
  const [maxValue, setMaxValue] = useState(100);

  const handleInputTypeChange = (e) => {
    setInputType(e.target.value);
  };

  const handleManualInputChange = (e) => {
    setManualInput(e.target.value);
  };

  const handleArraySizeChange = (e) => {
    setArraySize(parseInt(e.target.value));
  };

  const handleMinValueChange = (e) => {
    setMinValue(parseInt(e.target.value));
  };

  const handleMaxValueChange = (e) => {
    setMaxValue(parseInt(e.target.value));
  };

  const generateRandomArray = () => {
    const arr = [];
    for (let i = 0; i < arraySize; i++) {
      arr.push(
        Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
      );
    }
    return arr;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let selectedArray;
    if (inputType === "manual") {
      selectedArray = manualInput
        .split(",")
        .map((num) => parseInt(num.trim()))
        .filter((num) => !isNaN(num));
    } else {
      selectedArray = generateRandomArray();
    }
    onInputSelect(selectedArray);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`p-4 rounded-lg ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      }`}
    >
      <div className="mb-4">
        <label className="flex items-center mb-2">
          <input
            type="radio"
            value="manual"
            checked={inputType === "manual"}
            onChange={handleInputTypeChange}
            className="mr-2"
          />
          Manual Input
        </label>
        {inputType === "manual" && (
          <input
            type="text"
            value={manualInput}
            onChange={handleManualInputChange}
            placeholder="Enter numbers separated by commas"
            className={`w-full p-2 border rounded ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600"
                : "bg-white border-gray-300"
            }`}
          />
        )}
      </div>
      <div className="mb-4">
        <label className="flex items-center mb-2">
          <input
            type="radio"
            value="random"
            checked={inputType === "random"}
            onChange={handleInputTypeChange}
            className="mr-2"
          />
          Random Generation
        </label>
        {inputType === "random" && (
          <div className="flex space-x-2">
            <input
              type="number"
              value={arraySize}
              onChange={handleArraySizeChange}
              placeholder="Array Size"
              className={`w-1/3 p-2 border rounded ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />
            <input
              type="number"
              value={minValue}
              onChange={handleMinValueChange}
              placeholder="Min Value"
              className={`w-1/3 p-2 border rounded ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />
            <input
              type="number"
              value={maxValue}
              onChange={handleMaxValueChange}
              placeholder="Max Value"
              className={`w-1/3 p-2 border rounded ${
                theme === "dark"
                  ? "bg-gray-700 border-gray-600"
                  : "bg-white border-gray-300"
              }`}
            />
          </div>
        )}
      </div>
      <button
        type="submit"
        className={`w-full p-2 rounded ${
          theme === "dark"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-blue-500 hover:bg-blue-600"
        } text-white`}
      >
        Set Input
      </button>
    </form>
  );
}
