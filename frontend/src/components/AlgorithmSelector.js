import React from "react";

const AlgorithmSelector = ({ algorithms, onSelect }) => {
  return (
    <div>
      <h2>Select Algorithm</h2>
      <select onChange={(e) => onSelect(e.target.value)}>
        <option value="">Select an algorithm</option>
        {algorithms.map((algo) => (
          <option key={algo.name} value={algo.name}>
            {algo.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AlgorithmSelector;
