import Image from "next/image";
import { useState } from "react";

export default function ImageLoader({
  src,
  alt,
  width,
  height,
  quality,
  className,
  style,
  id,
  mouseMove,
  mouseOut,
  click,
  priority,
}) {
  const [imgSrc, set_imgSrc] = useState(src);
  const placeholder = `${process.env.NEXT_PUBLIC_URL}/images/placeholder.jpg`;
  return (
    <Image
      src={imgSrc}
      alt={alt || src || ""}
      width={width || 100}
      height={height || 100}
      className={className || null}
      style={style || null}
      placeholder={width < 40 ? "empty" : "blur"}
      blurDataURL={placeholder}
      id={id || null}
      onMouseMove={mouseMove || null}
      onMouseOut={mouseOut || null}
      onClick={click || null}
      quality={quality || null}
      priority={priority || undefined}
      onLoadingComplete={(result) => {
        if (result.naturalWidth === 0) {
          // Broken image
          set_imgSrc(placeholder);
        }
      }}
      onError={() => {
        set_imgSrc(placeholder);
      }}
    />
  );
}
