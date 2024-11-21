import React, { useState } from "react";
import Editor from "./editor";
import Preview from "./preview";
import "./app.css";

const App: React.FC = () => {
  const [doc, setDoc] = useState("_Start typing markdown...");

  return (
    <div className="app">
      <Editor initialDoc={doc} onChange={setDoc} />
      <Preview doc={doc} />
    </div>
  );
};

export default App;
