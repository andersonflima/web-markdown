import React, { useCallback, useEffect } from "react";
import useCodeMirror from "./use-codemirror";
import "./editor.css";

interface Props {
  initialDoc: string;
  onChange: (doc: string) => void;
}

const Editor: React.FC<Props> = ({ onChange, initialDoc }) => {
  const handleChange = useCallback(
    (state: { doc: { toString: () => string } }) => {
      onChange(state.doc.toString());
    },
    [onChange],
  );

  const [refContainer, editorView] = useCodeMirror<HTMLDivElement>({
    initialDoc,
    onChange: handleChange,
  });

  useEffect(() => {}, [editorView]);

  return <div className="editor-wrapper" ref={refContainer}></div>;
};

export default Editor;
