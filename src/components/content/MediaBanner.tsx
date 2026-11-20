import Image from "next/image";
import { cn } from "@/lib/utils";

export function MediaBanner({
  src,
  alt,
  className,
  priority = false,
  fit = "contain",
  objectPosition = "center",
  rounded = "2xl",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  fit?: "cover" | "contain";
  objectPosition?: string;
  rounded?: "xl" | "2xl" | "3xl" | "none";
}) {
  const radius =
    rounded === "none"
      ? ""
      : rounded === "xl"
        ? "rounded-xl"
        : rounded === "3xl"
          ? "rounded-3xl"
          : "rounded-2xl";

  return (
    <div
      className={cn(
        "overflow-hidden border border-brand-navy/8 bg-brand-navy shadow-[0_20px_50px_-24px_rgba(7,27,58,0.45)]",
        radius,
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={630}
        priority={priority}
        className={cn(
          "h-auto w-full",
          fit === "cover" ? "object-cover" : "object-contain",
        )}
        style={fit === "cover" ? { objectPosition } : undefined}
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
    </div>
  );
}
