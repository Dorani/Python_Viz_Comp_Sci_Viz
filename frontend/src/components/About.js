import React from "react";
import { motion } from "framer-motion";
import { Code, Play, Square, Eye, Zap, Edit3, BarChart } from "lucide-react";

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <motion.div
        className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-4xl w-full"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <h2 className="text-3xl font-bold mb-6 flex items-center justify-center">
          <Code className="mr-2 text-blue-400" />
          About Python Algo Visualizer
        </h2>
        <p className="mb-6 text-lg leading-relaxed text-center">
          Welcome to the Python Algorithm Visualizer! This tool is designed to
          help you understand and visualize various algorithms implemented in
          Python. Dive into the world of algorithms and see them come to life!
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center justify-center">
              <Play className="mr-2 text-green-400" />
              How to Use:
            </h3>
            <ol className="list-decimal list-inside mb-4 space-y-3">
              <li className="flex items-start">
                <span className="mr-2">1.</span>
                <span>Select an algorithm from the sidebar</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">2.</span>
                <span>Review or modify the Python code in the editor</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">3.</span>
                <span>Click "Start" to run the algorithm</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">4.</span>
                <span>Watch the visualization and analyze the insights</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">5.</span>
                <span>Use "Stop" to halt the execution at any time</span>
              </li>
            </ol>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4 flex items-center justify-center">
              <Eye className="mr-2 text-purple-400" />
              What to Expect:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Zap className="mr-2 text-yellow-400" />
                <span>Real-time visualization of algorithm execution</span>
              </li>
              <li className="flex items-center">
                <Square className="mr-2 text-red-400" />
                <span>Step-by-step breakdown of the algorithm's progress</span>
              </li>
              <li className="flex items-center">
                <BarChart className="mr-2 text-green-400" />
                <span>Performance metrics and insights</span>
              </li>
              <li className="flex items-center">
                <Edit3 className="mr-2 text-blue-400" />
                <span>Interactive code editor for experimentation</span>
              </li>
            </ul>
          </div>
        </div>
        <motion.p
          className="mt-8 text-xl font-semibold text-center text-blue-300"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Happy learning and enjoy exploring the world of algorithms!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default About;
