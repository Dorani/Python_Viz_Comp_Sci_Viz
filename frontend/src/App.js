import React, { useState, useEffect } from "react";
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

function AppContent() {
  const [algorithms, setAlgorithms] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("");
  const [code, setCode] = useState("");
  const [visualizationData, setVisualizationData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showAbout, setShowAbout] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    console.log("Component mounted, fetching algorithms...");
    axios
      .get(`${BACKEND_URL}/api/algorithms`, { withCredentials: true })
      .then((response) => {
        console.log("Fetched algorithms:", response.data);
        setAlgorithms(response.data);
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
      setVisualizationData((prevData) => [...prevData, step]);
    });

    socket.on("algorithm_complete", () => {
      console.log("Algorithm completed");
      setIsRunning(false);
    });

    socket.on("algorithm_stopped", () => {
      console.log("Algorithm stopped");
      setIsRunning(false);
    });

    socket.on("error", (error) => {
      console.error("Algorithm error:", error);
      setIsRunning(false);
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

  const handleAlgorithmSelect = (algorithmName) => {
    console.log("Selected algorithm:", algorithmName);
    setSelectedAlgorithm(algorithmName);
    setCode(
      `def ${algorithmName
        .toLowerCase()
        .replace(" ", "_")}(arr):\n    # Implementation goes here\n    pass`
    );
    setShowAbout(false);
  };

  const handleStart = (algorithm, inputArray) => {
    console.log("Starting algorithm:", algorithm);
    setIsRunning(true);
    setVisualizationData([]);
    socket.emit("execute_algorithm", {
      name: algorithm,
      input: inputArray,
    });
  };

  const handleStop = () => {
    console.log("Stopping algorithm");
    setIsRunning(false);
    socket.emit("stop_algorithm");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-gray-100"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <Navbar onMenuClick={toggleSidebar} onAboutClick={toggleAbout} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          algorithms={algorithms}
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
              path="/"
              element={
                <AlgorithmVisualizer
                  code={code}
                  onCodeChange={setCode}
                  visualizationData={visualizationData}
                  isRunning={isRunning}
                  onStart={handleStart}
                  onStop={handleStop}
                  selectedAlgorithm={selectedAlgorithm}
                />
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
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
