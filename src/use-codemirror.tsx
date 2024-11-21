import React, { useEffect, useRef, useState } from "react";
import { EditorView, ViewUpdate, keymap } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import {
  defaultHighlightStyle,
  tags,
  HighlightStyle,
} from "@codemirror/highlight";
import { oneDark } from "@codemirror/theme-one-dark";
import { history, historyKeymap } from "@codemirror/history";
import { defaultKeymap } from "@codemirror/commands";
import { indentOnInput } from "@codemirror/language";
import { lineNumbers, highlightActiveLineGutter } from "@codemirror/gutter";
import { bracketMatching } from "@codemirror/matchbrackets";
import { highlightActiveLine } from "@codemirror/view";

interface Props {
  initialDoc: string;
  onChange?: (state: EditorState) => void;
}

export const transparentTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent !important",
    height: "100%",
  },
});

const preprocessMarkdown = (doc: string): string => {
  return doc.replace(/\n/g, "  \n");
};

const syntaxHighlighting = HighlightStyle.define([
  {
    tag: tags.heading1,
    fontSize: "1.6em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading2,
    fontSize: "1.4em",
    fontWeight: "bold",
  },
  {
    tag: tags.heading3,
    fontSize: "1.2em",
    fontWeight: "bold",
  },
]);

const customKeyBindings = [
  {
    key: "Tab",
    run: (editor: EditorView): boolean => {
      const selection = editor.state.selection;
      if (selection) {
        editor.dispatch({
          changes: {
            from: selection.main.from,
            to: selection.main.to,
            insert: "  ",
          },
        });
      }
      return true;
    },
  },
  {
    key: "Shift-Tab",
    run: (editor: EditorView): boolean => {
      const selection = editor.state.selection;
      if (selection) {
        editor.dispatch({
          changes: {
            from: selection.main.from - 2,
            to: selection.main.to,
            insert: "",
          },
        });
      }
      return true;
    },
  },
];

const useCodeMirror = <T extends Element>(
  props: Props,
): [React.MutableRefObject<T | null>, EditorView | undefined] => {
  const refContainer = useRef<T>(null);
  const [editorView, setEditorView] = useState<EditorView>();

  const { onChange, initialDoc } = props;

  useEffect(() => {
    if (!refContainer.current) return;

    const startState = EditorState.create({
      doc: preprocessMarkdown(initialDoc),
      extensions: [
        keymap.of([...defaultKeymap, ...historyKeymap, ...customKeyBindings]),
        lineNumbers(),
        highlightActiveLineGutter(),
        history(),
        indentOnInput(),
        bracketMatching(),
        defaultHighlightStyle.fallback,
        highlightActiveLine(),
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
          addKeymap: true,
        }),
        oneDark,
        transparentTheme,
        syntaxHighlighting,
        EditorView.lineWrapping,
        EditorView.updateListener.of((update: ViewUpdate): void => {
          if (update.docChanged && onChange) {
            // console.log(update.docChanged);
            onChange(update.state);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: refContainer.current,
    });

    setEditorView(view);
  }, [refContainer, onChange]);

  return [refContainer, editorView];
};

export default useCodeMirror;
