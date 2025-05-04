// src/components/ui/Loader.tsx
import React from "react";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
}

export default function Loader({ size = "md", fullScreen = false, text }: LoaderProps) {
  // Size mapping
  const sizeMap = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const loaderSize = sizeMap[size];

  // Render full screen loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50">
        <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-500 ${loaderSize}`}></div>
        {text && <p className="mt-4 text-white">{text}</p>}
      </div>
    );
  }

  // Render inline loader
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-500 ${loaderSize}`}></div>
      {text && <p className="mt-2 text-sm">{text}</p>}
    </div>
  );
}