"use client";

const CustomCodeRenderer = ({ content }: any) => {
  content;

  return (
    <pre className="bg-secondary rounded-md p-4">
      <code className="text-muted-foreground text-sm">{content.code}</code>
    </pre>
  );
};

export default CustomCodeRenderer;
