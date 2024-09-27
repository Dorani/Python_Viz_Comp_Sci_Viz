import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AlgorithmVisualizer from "./components/AlgorithmVisualizer";
import About from "./components/About";
import Register from "./components/Register";
import Login from "./components/Login";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";

const BACKEND_URL = "http://localhost:5001";
const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"],
});

const initialAlgorithms = [
  { id: "tree-1", name: "Binary Tree Traversal", category: "Trees" },
  { id: "tree-2", name: "Binary Search Tree Insertion", category: "Trees" },
];

function AppContent() {
  const [algorithms, setAlgorithms] = useState(initialAlgorithms);
  const algorithmsRef = useRef(initialAlgorithms);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [code, setCode] = useState("");
  const [visualizationData, setVisualizationData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useTheme();

  useEffect(() => {
    console.log("Component mounted, fetching algorithms...");
    axios
      .get(`${BACKEND_URL}/api/algorithms`, { withCredentials: true })
      .then((response) => {
        console.log("Fetched algorithms:", response.data);
        const fetchedAlgorithms = response.data.map((algo, index) => ({
          ...algo,
          id: `sorting-${index + 1}`,
        }));
        // Merge fetched algorithms with initial algorithms, removing duplicates
        const mergedAlgorithms = [
          ...fetchedAlgorithms,
          ...initialAlgorithms.filter(
            (algo) =>
              !fetchedAlgorithms.some(
                (fetchedAlgo) => fetchedAlgo.name === algo.name
              )
          ),
        ];
        console.log("Merged algorithms:", mergedAlgorithms);
        setAlgorithms(mergedAlgorithms);
        algorithmsRef.current = mergedAlgorithms;
      })
      .catch((error) => {
        console.error("Error fetching algorithms:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        }
      });

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.on("algorithm_step", (step) => {
      console.log("Received algorithm step:", step);
      setVisualizationData((prevData) => {
        const newData = [...prevData, step];
        console.log("Updated visualization data:", newData);
        return newData;
      });
    });

    socket.on("algorithm_complete", () => {
      console.log("Algorithm completed");
      setIsRunning(false);
      setIsPlaying(false);
    });

    socket.on("algorithm_stopped", () => {
      console.log("Algorithm stopped");
      setIsRunning(false);
      setIsPlaying(false);
    });

    socket.on("error", (error) => {
      console.error("Algorithm error:", error);
      setIsRunning(false);
      setIsPlaying(false);
    });

    return () => {
      socket.off("algorithm_step");
      socket.off("algorithm_complete");
      socket.off("algorithm_stopped");
      socket.off("error");
      socket.off("connect");
      socket.off("connect_error");
    };
  }, []);

  useEffect(() => {
    console.log("Algorithms updated:", algorithms);
    algorithmsRef.current = algorithms;
  }, [algorithms]);

  const handleAlgorithmSelect = useCallback((algorithmName) => {
    console.log("Selected algorithm:", algorithmName);
    setSelectedAlgorithm(algorithmName);
    const isTreeAlgorithm = algorithmName.toLowerCase().includes("tree");
    setCode(
      isTreeAlgorithm
        ? `def ${algorithmName.toLowerCase().replace(" ", "_")}(tree):
    # Implementation goes here
    pass`
        : `def ${algorithmName.toLowerCase().replace(" ", "_")}(arr):
    # Implementation goes here
    pass`
    );
  }, []);

  const handleStart = useCallback((algorithm, inputData) => {
    console.log("Starting algorithm:", algorithm, "with input:", inputData);
    setIsRunning(true);
    setIsPlaying(true);
    setVisualizationData([]);
    setCurrentStep(0);
    socket.emit("execute_algorithm", {
      name: algorithm,
      input: inputData,
    });
  }, []);

  const handleStop = useCallback(() => {
    console.log("Stopping algorithm");
    setIsRunning(false);
    setIsPlaying(false);
    setCurrentStep(0);
    socket.emit("stop_algorithm");
  }, []);

  const handlePlayPause = useCallback(() => {
    console.log("Play/Pause toggled");
    setIsPlaying((prev) => !prev);
  }, []);

  const handleStepForward = useCallback(() => {
    if (currentStep < visualizationData.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, visualizationData.length]);

  const handleStepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div
      className={`flex flex-col h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Navbar onMenuClick={toggleSidebar} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          algorithms={algorithmsRef.current}
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmSelect={handleAlgorithmSelect}
          isOpen={isSidebarOpen}
          onClose={toggleSidebar}
        />
        <div
          className={`flex-1 overflow-hidden transition-all duration-300 ${
            isSidebarOpen ? "ml-64" : "ml-0"
          }`}
        >
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/home"
              element={
                <AlgorithmVisualizer
                  code={code}
                  onCodeChange={setCode}
                  visualizationData={visualizationData}
                  isRunning={isRunning}
                  isPlaying={isPlaying}
                  onStart={handleStart}
                  onStop={handleStop}
                  onPlayPause={handlePlayPause}
                  onStepForward={handleStepForward}
                  onStepBackward={handleStepBackward}
                  selectedAlgorithm={selectedAlgorithm}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStep}
                />
              }
            />
            <Route path="/" element={<Navigate to="/about" replace />} />
            <Route path="*" element={<Navigate to="/about" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </Router>
  );
}

export default App;
