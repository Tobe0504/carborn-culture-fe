import { useRef, useState, type DragEvent } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { cn } from "@/lib/format";
import { sizedImage } from "@/lib/image";
import type { ProductImage } from "@/types";

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_BYTES = 8 * 1024 * 1024;

interface ImageUploaderProps {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
  max?: number;
}

const ImageUploader = ({ images, onChange, max = 10 }: ImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    const room = max - images.length;
    const files = Array.from(fileList).slice(0, room);

    if (fileList.length > room) toast.error(`You can add up to ${max} images per product.`);

    const valid = files.filter((file) => {
      if (!ACCEPTED.includes(file.type)) {
        toast.error(`${file.name} isn't a JPG, PNG, WebP or AVIF image.`);
        return false;
      }
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name} is larger than 8MB.`);
        return false;
      }
      return true;
    });

    if (!valid.length) return;
    setUploading(valid.length);

    const results = await Promise.allSettled(valid.map((file) => api.admin.uploadImage(file)));
    const uploaded = results.flatMap((result) => (result.status === "fulfilled" ? [result.value] : []));
    const failed = results.filter((result) => result.status === "rejected") as PromiseRejectedResult[];

    if (failed.length) toast.error(failed[0].reason?.message || "Some images failed to upload.");
    if (uploaded.length) onChange([...images, ...uploaded]);
    setUploading(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    const next = [...images];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setDragging(false);
    void handleFiles(event.dataTransfer.files);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {images.map((image, index) => (
          <div key={image.url} className="group relative">
            <img src={sizedImage(image.url, 300)} alt="" className="aspect-[3/4] w-full bg-sand object-cover" />
            {index === 0 && (
              <span className="absolute left-1.5 top-1.5 bg-ink px-1.5 py-0.5 text-[10px] uppercase tracking-[0.1em] text-paper">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, i) => i !== index))}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-paper/95 shadow transition-colors hover:bg-[#B42318] hover:text-white"
              aria-label={`Remove image ${index + 1}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {images.length > 1 && (
              <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <button
                  type="button"
                  onClick={() => move(index, index - 1)}
                  disabled={index === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-paper/95 shadow disabled:invisible"
                  aria-label="Move earlier"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => move(index, index + 1)}
                  disabled={index === images.length - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-paper/95 shadow disabled:invisible"
                  aria-label="Move later"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}

        {Array.from({ length: uploading }, (_, index) => (
          <div key={`up-${index}`} className="flex aspect-[3/4] items-center justify-center bg-sand">
            <Loader2 className="h-5 w-5 animate-spin text-stone" />
          </div>
        ))}

        {images.length + uploading < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={cn(
              "flex aspect-[3/4] flex-col items-center justify-center gap-2 border border-dashed text-center text-[13px] text-stone transition-colors",
              dragging ? "border-ink bg-cream text-ink" : "border-line hover:border-ink hover:text-ink",
            )}
          >
            <ImagePlus className="h-6 w-6" strokeWidth={1.2} />
            <span className="px-2">Add images</span>
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(",")}
        multiple
        className="hidden"
        onChange={(event) => void handleFiles(event.target.files)}
      />
      <p className="mt-3 text-[13px] text-stone">
        JPG, PNG, WebP or AVIF up to 8MB. The first image is the cover. Portrait (3:4) photos look best.
      </p>
    </div>
  );
};

export default ImageUploader;
