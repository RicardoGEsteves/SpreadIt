"use client";

import { BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { Uploader } from "@/lib/uploadthing";

type EditorSetupProps = {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
};

const EditorSetup = ({ onChange, editable }: EditorSetupProps) => {
  const handleUpload = async (file: File) => {
    const uploadData = { file: file, endpoint: "imageUploader" as const };
    const res = await Uploader(uploadData);

    return res.props.file;
  };

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload,
  });

  return (
    <BlockNoteView
      editor={editor}
      theme="dark"
    />
  );
};

export default EditorSetup;
