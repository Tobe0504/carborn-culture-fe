import { cn } from "@/lib/format";

const MARK_URL =
  "https://res.cloudinary.com/djwgvlvdv/image/upload/e_trim/f_png,q_auto,h_240/v1791359365/WhatsApp_Image_2026-10-06_at_19.30_Background_Removed_Background_Removed.38-removebg-preview.png";

const VARIANTS = {
  mark: { src: MARK_URL, width: 288, height: 240, size: "h-24" },
  wordmark: { src: "/logo-wordmark.png", width: 453, height: 92, size: "h-6" },
} as const;

interface LogoProps {
  className?: string;
  tone?: "ink" | "paper";
  variant?: keyof typeof VARIANTS;
}

const Logo = ({ className, tone = "ink", variant = "wordmark" }: LogoProps) => {
  const { src, width, height, size } = VARIANTS[variant];

  return (
    <img
      src={src}
      width={width}
      height={height}
      alt="Carbon Culture"
      draggable={false}
      className={cn(
        "block w-auto select-none transition-[filter] duration-300",
        size,
        tone === "paper" && "brightness-0 invert",
        className,
      )}
    />
  );
};

export default Logo;
