"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import "@blocknote/core/style.css";
import { uploadFiles } from "@/lib/uploadthing";

type EditorSetupProps = {
  onChange: (value: string) => void;
  content?: any;
  editable?: boolean;
};

const EditorSetup = ({ onChange, editable, content }: EditorSetupProps) => {
  const handleUploadFile = async (file: File): Promise<string> => {
    try {
      const endpoint = "imageUploader";
      const options = {
        files: [file],
      };

      const [res] = await uploadFiles(endpoint, options);

      return res.url;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw new Error("File upload failed");
    }
  };

  const initialContentToPartialBlock = () => {
    if (content && typeof content === "string") {
      //@ts-expect-error
      return JSON.parse(content) as PartialBlock[];
    } else {
      return [];
    }
  };

  //TODO: FIX HYPERLINK URL PROP/CONFIG
  const editor: BlockNoteEditor = useBlockNote({
    initialContent: initialContentToPartialBlock(),
    editable,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUploadFile,
  });

  return (
    <BlockNoteView
      editor={editor}
      theme="dark"
    />
  );
};

export default EditorSetup;
