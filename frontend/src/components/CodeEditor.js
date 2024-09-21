import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, onChange }) => {
  return (
    <div>
      <h2>Code Editor</h2>
      <Editor
        height="800px"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={onChange}
      />
    </div>
  );
};

export default CodeEditor;
