import React from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkReact from "remark-react";
import remarkBreaks from "remark-breaks";
import RemarkCode from "./remark-code";
import { defaultSchema } from "hast-util-sanitize";
import "./preview.css";
import "github-markdown-css/github-markdown.css";

interface Props {
  doc: string;
}

const scheme = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [...(defaultSchema.attributes?.code || []), "className"],
  },
};

const remarkReactComponents: { [key: string]: React.ComponentType<any> } = {
  code: RemarkCode,
};

const Preview: React.FC<Props> = ({ doc }) => {
  const md = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkReact, {
      createElement: (type: any, props?: any, ...children: any[]) =>
        React.createElement(type, props, ...children),
      sanitize: scheme,
      remarkReactComponents,
    })
    .processSync(doc).result as React.ReactElement;

  return <div className="preview markdown-body">{md}</div>;
};

export default Preview;
