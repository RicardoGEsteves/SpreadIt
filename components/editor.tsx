"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
// import { uploadFiles } from "@/lib/uploadthing";

type EditorProps = {
  initialContent?: string;
  editable?: boolean;
  onChange: (content: string) => void;
};

const Editor = ({ initialContent, editable, onChange }: EditorProps) => {
  const editor: BlockNoteEditor = useBlockNote({
    editable,
    // initialContent: initialContent
    //   ? (JSON.parse(initialContent) as PartialBlock[])
    //   : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
      //   onChange(
      //     JSON.stringify(editor.topLevelBlocks.map((block) => block.content))
      //   );
    },

    // uploadFile: uploadFiles,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={"dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
