import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/format";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
}

const Reveal = ({ children, className, delay = 0, as: Tag = "div" }: RevealProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const style: CSSProperties = { transitionDelay: `${delay}ms` };

  return (
    <Tag
      ref={ref as never}
      style={style}
      className={cn(
        "transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
        className,
      )}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
