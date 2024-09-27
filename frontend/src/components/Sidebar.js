import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { ChevronDown, ChevronRight } from "lucide-react";

const Sidebar = ({
  algorithms = [],
  selectedAlgorithm,
  onAlgorithmSelect,
  isOpen,
  onClose,
}) => {
  const { theme } = useTheme();
  const [expandedCategories, setExpandedCategories] = useState([
    "Sorting",
    "Trees",
  ]);
  const [categorizedAlgorithms, setCategorizedAlgorithms] = useState({});

  const categorizeAlgorithms = useCallback((algos) => {
    console.log("Categorizing algorithms:", algos);
    if (!Array.isArray(algos) || algos.length === 0) {
      console.warn("Invalid algorithms array:", algos);
      return {};
    }
    return algos.reduce((acc, algorithm) => {
      if (!algorithm || typeof algorithm !== "object" || !algorithm.category) {
        console.warn("Invalid algorithm object:", algorithm);
        return acc;
      }
      if (!acc[algorithm.category]) {
        acc[algorithm.category] = [];
      }
      acc[algorithm.category].push(algorithm);
      return acc;
    }, {});
  }, []);

  useEffect(() => {
    console.log("Sidebar received algorithms:", algorithms);
    const categorized = categorizeAlgorithms(algorithms);
    console.log("Categorized algorithms:", categorized);
    setCategorizedAlgorithms(categorized);
  }, [algorithms, categorizeAlgorithms]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  if (Object.keys(categorizedAlgorithms).length === 0) {
    return (
      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed left-0 top-0 bottom-0 w-64 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white transition-transform duration-300 ease-in-out overflow-y-auto z-50`}
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Algorithms</h2>
          <p>No algorithms available.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } fixed left-0 top-0 bottom-0 w-64 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white transition-transform duration-300 ease-in-out overflow-y-auto z-50`}
    >
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Algorithms</h2>
        {Object.entries(categorizedAlgorithms).map(([category, algos]) => (
          <div key={category} className="mb-4">
            <button
              onClick={() => toggleCategory(category)}
              className={`flex items-center justify-between w-full text-left font-semibold mb-2 ${
                theme === "dark" ? "text-white" : "text-gray-800"
              }`}
            >
              {category}
              {expandedCategories.includes(category) ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            {expandedCategories.includes(category) && (
              <ul className="ml-4">
                {algos.map((algo) => (
                  <li key={algo.id} className="mb-2">
                    <button
                      onClick={() => onAlgorithmSelect(algo.name)}
                      className={`w-full text-left px-2 py-1 rounded ${
                        selectedAlgorithm === algo.name
                          ? "bg-blue-500 text-white"
                          : `hover:bg-gray-200 dark:hover:bg-gray-700 ${
                              theme === "dark" ? "text-white" : "text-gray-800"
                            }`
                      }`}
                    >
                      {algo.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
