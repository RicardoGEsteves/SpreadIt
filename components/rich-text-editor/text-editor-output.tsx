"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

type TextEditorOutputProps = {
  content: any;
};

const TextEditorOutput = ({ content }: TextEditorOutputProps) => {
  const EditorSetup = useMemo(
    () =>
      dynamic(() => import("@/components/rich-text-editor/editor-setup"), {
        ssr: false,
      }),
    []
  );

  const handleNoOperation = () => {};

  return (
    <EditorSetup
      onChange={handleNoOperation}
      editable={false}
      content={content}
    />
  );
};

export default TextEditorOutput;
