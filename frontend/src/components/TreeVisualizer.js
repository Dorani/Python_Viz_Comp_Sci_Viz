import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const TreeVisualizer = ({ data, currentStep, theme }) => {
  const svgRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const drawTree = () => {
      if (!data || !data[currentStep] || !data[currentStep].treeState) {
        console.warn("No tree data available for visualization");
        setError("No tree data available for visualization");
        return;
      }

      const treeData = data[currentStep].treeState;
      console.log("Tree data:", JSON.stringify(treeData, null, 2));

      // Clear previous content and error
      d3.select(svgRef.current).selectAll("*").remove();
      setError(null);

      try {
        const width = 600;
        const height = 400;
        const margin = { top: 20, right: 90, bottom: 30, left: 90 };

        const svg = d3
          .select(svgRef.current)
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

        const treemap = d3.tree().size([height, width - 200]);

        // Create a root node if it doesn't exist
        const rootNode = Array.isArray(treeData)
          ? { value: "Root", children: treeData }
          : treeData;

        // Recursive function to remove null children
        const cleanNode = (node) => {
          if (node.children) {
            node.children = node.children.filter((child) => child !== null);
            node.children.forEach(cleanNode);
          }
          return node;
        };

        const cleanedRoot = cleanNode(rootNode);

        const root = d3.hierarchy(cleanedRoot);
        const treeRoot = treemap(root);

        // Draw links
        svg
          .selectAll(".link")
          .data(treeRoot.links())
          .enter()
          .append("path")
          .attr("class", "link")
          .attr(
            "d",
            d3
              .linkHorizontal()
              .x((d) => d.y)
              .y((d) => d.x)
          )
          .attr("fill", "none")
          .attr("stroke", theme === "dark" ? "#555" : "#999")
          .attr("stroke-width", 1.5);

        const node = svg
          .selectAll(".node")
          .data(treeRoot.descendants())
          .enter()
          .append("g")
          .attr(
            "class",
            (d) => "node" + (d.children ? " node--internal" : " node--leaf")
          )
          .attr("transform", (d) => `translate(${d.y},${d.x})`);

        node
          .append("circle")
          .attr("r", 10)
          .attr("fill", theme === "dark" ? "#4a90e2" : "#2c5282")
          .attr("stroke", theme === "dark" ? "#fff" : "#000")
          .attr("stroke-width", 3);

        node
          .append("text")
          .attr("dy", ".35em")
          .attr("x", (d) => (d.children ? -13 : 13))
          .style("text-anchor", (d) => (d.children ? "end" : "start"))
          .text((d) => d.data.value)
          .attr("fill", theme === "dark" ? "#fff" : "#000");
      } catch (err) {
        console.error("Error in tree visualization:", err);
        setError(`Error in tree visualization: ${err.message}`);
      }
    };

    drawTree();
  }, [data, currentStep, theme]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
    </div>
  );
};

export default TreeVisualizer;
