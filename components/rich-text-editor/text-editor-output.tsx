"use client";

// import CustomCodeRenderer from "@/components/renderers/custom-code-renderer";
// import CustomImageRenderer from "@/components/renderers/custom-image-renderer";
import EditorSetup from "./editor-setup";

type TextEditorOutputProps = {
  content: any;
};

const TextEditorOutput = ({ content }: TextEditorOutputProps) => {
  return (
    // TODO: Check if need to use renderers and further customizations
    //   className="text-sm"
    //   renderers={renderers}
    //   children={content}
    <EditorSetup
      onChange={() => {}}
      editable={false}
      content={content}
    />
  );
};

export default TextEditorOutput;
