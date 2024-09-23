import React from "react";
import { useTheme } from "../contexts/ThemeContext";

const Sidebar = ({
  algorithms,
  selectedAlgorithm,
  onAlgorithmSelect,
  isOpen,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      } shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } z-20 overflow-y-auto`}
    >
      <div className="p-4 sticky top-0 bg-opacity-90 backdrop-filter backdrop-blur-sm">
        <h2
          className={`text-xl font-semibold ${
            theme === "dark" ? "text-white" : "text-gray-800"
          }`}
        >
          Algorithms
        </h2>
      </div>
      <nav className="mt-4">
        <ul>
          {algorithms.map((algorithm) => (
            <li key={algorithm.id}>
              <button
                onClick={() => onAlgorithmSelect(algorithm.name)}
                className={`w-full text-left px-4 py-2 ${
                  selectedAlgorithm === algorithm.name
                    ? theme === "dark"
                      ? "bg-blue-600 text-white"
                      : "bg-blue-100 text-blue-800"
                    : theme === "dark"
                    ? "text-gray-300 hover:bg-gray-700"
                    : "text-gray-800 hover:bg-gray-100"
                }`}
              >
                {algorithm.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
