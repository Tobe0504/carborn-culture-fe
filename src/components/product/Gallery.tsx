import { useState } from "react";
import { cn } from "@/lib/format";
import { sizedImage } from "@/lib/image";
import type { ProductImage } from "@/types";

interface GalleryProps {
  images: ProductImage[];
  alt: string;
}

const Gallery = ({ images, alt }: GalleryProps) => {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];

  return (
    <div>
      <div className="flex justify-center bg-sand">
        <img
          key={current?.url}
          src={sizedImage(current?.url, 1400)}
          alt={alt}
          className="h-[min(125vw,75vh)] max-h-[820px] w-full animate-fade-in object-contain"
        />
      </div>
      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
          {images.map((image, imageIndex) => (
            <button
              key={image.url}
              type="button"
              onClick={() => setIndex(imageIndex)}
              className={cn(
                "w-16 shrink-0 border transition-colors",
                imageIndex === index ? "border-ink" : "border-transparent opacity-70 hover:opacity-100",
              )}
              aria-label={`Show image ${imageIndex + 1}`}
              aria-current={imageIndex === index}
            >
              <img src={sizedImage(image.url, 160)} alt="" className="aspect-[4/5] w-full bg-sand object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
