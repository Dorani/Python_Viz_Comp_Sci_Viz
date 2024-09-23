import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Play,
  Square,
  Eye,
  Zap,
  Edit3,
  BarChart,
  Shuffle,
  List,
  FastForward,
  Rewind,
  Pause,
} from "lucide-react";

const About = () => {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const floatAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 px-4 py-12">
      <motion.div
        className="bg-gray-800 text-white p-8 rounded-lg shadow-lg max-w-5xl w-full"
        initial="initial"
        animate="animate"
        variants={fadeIn}
      >
        <motion.h2
          className="text-4xl font-bold mb-6 flex items-center justify-center"
          animate={floatAnimation}
        >
          <Code className="mr-2 text-blue-400" />
          Python Algo Visualizer: Dive into the World of Algorithms!
        </motion.h2>
        <p className="mb-8 text-xl leading-relaxed text-center">
          Welcome to an exciting journey through algorithms and data structures!
          Our interactive tool brings Python algorithms to life, making learning
          both fun and insightful.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center">
              <Play className="mr-2 text-green-400" />
              Your Adventure Begins Here:
            </h3>
            <ol className="list-decimal list-inside space-y-4">
              <motion.li
                className="flex items-start"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
              >
                <span className="mr-2 font-bold">1.</span>
                <span>
                  Choose Your Algorithm:{" "}
                  <List className="inline text-yellow-400" /> Select from our
                  curated list of fascinating algorithms
                </span>
              </motion.li>
              <motion.li
                className="flex items-start"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
              >
                <span className="mr-2 font-bold">2.</span>
                <span>
                  Prepare Your Data:{" "}
                  <Shuffle className="inline text-purple-400" /> Generate random
                  input or craft your own dataset
                </span>
              </motion.li>
              <motion.li
                className="flex items-start"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
              >
                <span className="mr-2 font-bold">3.</span>
                <span>
                  Dive into the Code: <Edit3 className="inline text-blue-400" />{" "}
                  Review or tweak the Python implementation
                </span>
              </motion.li>
              <motion.li
                className="flex items-start"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
              >
                <span className="mr-2 font-bold">4.</span>
                <span>
                  Launch the Visualization:{" "}
                  <Play className="inline text-green-400" /> Hit 'Start' and
                  watch the algorithm unfold
                </span>
              </motion.li>
              <motion.li
                className="flex items-start"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
              >
                <span className="mr-2 font-bold">5.</span>
                <span>
                  Control the Flow: <Pause className="inline text-orange-400" />{" "}
                  <FastForward className="inline text-pink-400" />{" "}
                  <Rewind className="inline text-indigo-400" /> Navigate through
                  each step at your own pace
                </span>
              </motion.li>
            </ol>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-6 flex items-center justify-center">
              <Eye className="mr-2 text-purple-400" />
              Unleash the Power of Visualization:
            </h3>
            <ul className="space-y-4">
              <motion.li
                className="flex items-center"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
              >
                <Zap className="mr-2 text-yellow-400" />
                <span>Watch algorithms come to life in real-time</span>
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
              >
                <Square className="mr-2 text-red-400" />
                <span>Witness step-by-step transformations of your data</span>
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
              >
                <BarChart className="mr-2 text-green-400" />
                <span>
                  Gain insights through performance metrics and comparisons
                </span>
              </motion.li>
              <motion.li
                className="flex items-center"
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
              >
                <Edit3 className="mr-2 text-blue-400" />
                <span>Experiment with code and see instant results</span>
              </motion.li>
            </ul>
          </div>
        </div>

        <motion.div
          className="bg-gray-700 p-6 rounded-lg shadow-inner"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-center text-green-400">
            Why Visualize Algorithms?
          </h3>
          <p className="text-lg mb-4">
            Visualization brings abstract concepts to life, making it easier to
            understand complex algorithms. By seeing the step-by-step process,
            you'll gain deeper insights into how algorithms work, their
            efficiency, and how they transform data.
          </p>
          <div className="flex justify-center space-x-4">
            <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
              <motion.div
                className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-2 mx-auto"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Zap className="text-white" size={32} />
              </motion.div>
              <p>Faster Learning</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
              <motion.div
                className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2 mx-auto"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Eye className="text-white" size={32} />
              </motion.div>
              <p>Better Retention</p>
            </motion.div>
            <motion.div className="text-center" whileHover={{ scale: 1.1 }}>
              <motion.div
                className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mb-2 mx-auto"
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <BarChart className="text-white" size={32} />
              </motion.div>
              <p>Deep Understanding</p>
            </motion.div>
          </div>
        </motion.div>

        <motion.p
          className="mt-8 text-2xl font-semibold text-center text-blue-300"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Ready to embark on your algorithm adventure? Let's dive in and unlock
          the secrets of efficient computing!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default About;
