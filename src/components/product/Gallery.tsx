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
    <>
      <div className="lg:hidden">
        <div
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto bg-sand"
          onScroll={(event) => {
            const el = event.currentTarget;
            setIndex(Math.round(el.scrollLeft / el.clientWidth));
          }}
        >
          {images.map((image, imageIndex) => (
            <img
              key={image.url}
              src={sizedImage(image.url, 1000)}
              alt={imageIndex === 0 ? alt : ""}
              className="h-[min(125vw,72vh)] w-full shrink-0 snap-start object-cover sm:object-contain"
            />
          ))}
        </div>
        {images.length > 1 && (
          <div className="relative h-px bg-line">
            <span
              className="absolute inset-y-0 bg-ink transition-[left] duration-300"
              style={{ width: `${100 / images.length}%`, left: `${(100 / images.length) * index}%` }}
            />
          </div>
        )}
      </div>

      <div className="hidden h-full gap-6 lg:flex">
        {images.length > 1 && (
          <div className="flex w-[52px] shrink-0 flex-col gap-3 pt-2">
            {images.map((image, imageIndex) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setIndex(imageIndex)}
                className={cn(
                  "relative pb-1.5 transition-opacity",
                  imageIndex === index ? "opacity-100" : "opacity-50 hover:opacity-100",
                )}
                aria-label={`Show image ${imageIndex + 1}`}
                aria-current={imageIndex === index}
              >
                <img src={sizedImage(image.url, 160)} alt="" className="aspect-[4/5] w-full bg-sand object-cover" />
                <span
                  className={cn(
                    "absolute bottom-0 left-0 h-px w-full bg-ink transition-transform duration-300",
                    imageIndex === index ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            ))}
          </div>
        )}
        <div className="flex flex-1 items-start justify-center">
          <img
            key={current?.url}
            src={sizedImage(current?.url, 1600)}
            alt={alt}
            className="max-h-[min(calc(100vh-140px),860px)] w-auto max-w-[min(100%,680px)] animate-fade-in object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default Gallery;
