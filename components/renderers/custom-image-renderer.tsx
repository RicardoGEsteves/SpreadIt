"use client";

import Image from "next/image";

const CustomImageRenderer = ({ content }: any) => {
  //TODO: or use content.url check it out
  const src = content.file.url;

  return (
    <div className="relative w-full min-h-[15rem]">
      <Image
        alt="image"
        className="object-contain"
        fill
        src={src}
      />
    </div>
  );
};

export default CustomImageRenderer;
