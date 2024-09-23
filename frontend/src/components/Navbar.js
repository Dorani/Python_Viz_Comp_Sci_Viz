import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";
import { Code, Info, User, Home, Sun, Moon, Menu, X } from "lucide-react";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className={`${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
      } p-4 shadow-md sticky top-0 z-50`}
    >
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/home" className="flex items-center space-x-2">
              <Code
                className={`w-8 h-8 ${
                  theme === "dark" ? "text-blue-400" : "text-blue-600"
                }`}
              />
            </Link>
          </div>
          <div className="flex-grow flex justify-center">
            <h1 className="text-xl font-bold whitespace-nowrap">
              Python Algo Visualizer
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/home"
                className={`flex items-center space-x-1 hover:${
                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                } transition duration-300 whitespace-nowrap`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className={`flex items-center space-x-1 hover:${
                  theme === "dark" ? "text-blue-300" : "text-blue-600"
                } transition duration-300 whitespace-nowrap`}
              >
                <Info className="w-5 h-5" />
                <span>About</span>
              </Link>
            </div>
            <button
              onClick={toggleTheme}
              className={`${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              } text-current font-bold p-2 rounded transition duration-300`}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to="/login"
                className={`${
                  theme === "dark"
                    ? "bg-blue-500 hover:bg-blue-600"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center whitespace-nowrap`}
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Link>
              <Link
                to="/register"
                className={`${
                  theme === "dark"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-green-600 hover:bg-green-700"
                } text-white font-bold py-2 px-4 rounded transition duration-300 whitespace-nowrap`}
              >
                Register
              </Link>
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden ${
                theme === "dark" ? "text-white" : "text-gray-800"
              } focus:outline-none`}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden mt-4 px-4">
          <div className="flex flex-col space-y-2">
            <Link
              to="/home"
              className={`flex items-center space-x-1 hover:${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              } transition duration-300`}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>
            <Link
              to="/about"
              className={`flex items-center space-x-1 hover:${
                theme === "dark" ? "text-blue-300" : "text-blue-600"
              } transition duration-300`}
            >
              <Info className="w-5 h-5" />
              <span>About</span>
            </Link>
            <Link
              to="/login"
              className={`${
                theme === "dark"
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white font-bold py-2 px-4 rounded transition duration-300 flex items-center`}
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Link>
            <Link
              to="/register"
              className={`${
                theme === "dark"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-green-600 hover:bg-green-700"
              } text-white font-bold py-2 px-4 rounded transition duration-300`}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
