# Algorithm Visualizer

Algorithm Visualizer is an interactive web application that helps users understand various algorithms through step-by-step visualizations. It currently supports binary tree traversals and other array-based algorithms.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Key Components](#key-components)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation

To run this project locally, follow these steps:

### Prerequisites

- Node.js (v14 or later)
- Python (v3.7 or later)
- npm (usually comes with Node.js)

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/algorithm-visualizer.git
   cd algorithm-visualizer
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\\Scripts\\activate`
   ```

3. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server:
   ```bash
   python run.py
   ```

## Usage

Once both frontend and backend servers are running:

1. Open your web browser and navigate to `http://localhost:3000` (or the port specified by your frontend server).
2. Select an algorithm from the sidebar.
3. Use the input selector to choose or input data for the algorithm.
4. Click the "Start" button to begin the visualization.
5. Use the playback controls to step through the algorithm or adjust the playback speed.

## Key Components

### AlgorithmVisualizer

The main component that orchestrates the visualization process.

```jsx
import React from "react";
import CodeEditor from "./CodeEditor";
import Visualizer from "./Visualizer";
import Controls from "./Controls";

export default function AlgorithmVisualizer({ selectedAlgorithm }) {
  // ... state and effect hooks ...

  return (
    <div className="flex flex-col h-full">
      <CodeEditor code={code} onCodeChange={setCode} />
      <Visualizer
        data={visualizationData}
        currentStep={currentStep}
        theme="light"
      />
      <Controls
        isRunning={isRunning}
        isPlaying={isPlaying}
        onStart={handleStart}
        onStop={handleStop}
        onPlayPause={handlePlayPause}
        onStepForward={handleStepForward}
        onStepBackward={handleStepBackward}
      />
    </div>
  );
}
```

### TreeVisualizer

A component for visualizing tree-based algorithms using D3.js.

```jsx
import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const TreeVisualizer = ({ data, currentStep, theme }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    // D3.js visualization logic
    // ...
  }, [data, currentStep, theme]);

  return <svg ref={svgRef}></svg>;
};

export default TreeVisualizer;
```

## Technologies Used

- Frontend:
  - React
  - Next.js
  - D3.js for visualizations
  - Tailwind CSS for styling
- Backend:
  - Python
  - Flask

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
