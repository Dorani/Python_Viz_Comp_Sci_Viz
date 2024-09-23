import React from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, onChange, height, theme }) => {
  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <Editor
      height={height}
      defaultLanguage="python"
      value={code}
      onChange={handleEditorChange}
      theme={theme === "dark" ? "vs-dark" : "light"}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollbar: {
          vertical: "visible",
          horizontal: "visible",
          useShadows: false,
          verticalScrollbarSize: 10,
          horizontalScrollbarSize: 10,
        },
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        overviewRulerBorder: false,
      }}
    />
  );
};

export default CodeEditor;
