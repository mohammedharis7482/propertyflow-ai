"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { getPremiumAgentFallbackImage } from "@/constants/agent-images";

type AgentImageProps = Omit<ImageProps, "src" | "alt" | "onError"> & {
  src?: string | null;
  alt: string;
  fallbackSeed?: string | number | null;
};

export function AgentImage({ src, alt, fallbackSeed, ...props }: AgentImageProps) {
  const fallback = getPremiumAgentFallbackImage(fallbackSeed ?? alt);
  const [imageSrc, setImageSrc] = useState(src || fallback);

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      onError={() => {
        if (imageSrc !== fallback) {
          setImageSrc(fallback);
        }
      }}
    />
  );
}
