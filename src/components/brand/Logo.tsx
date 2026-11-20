import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

const logos = {
  header: {
    src: "/images/logo.png",
    width: 1983,
    height: 793,
  },
  footer: {
    src: "/images/footer-logo.png",
    width: 1914,
    height: 822,
  },
} as const;

export function Logo({
  href = "/",
  tone = "dark",
  variant,
  className,
}: {
  href?: string;
  tone?: "dark" | "light";
  variant?: "header" | "footer";
  className?: string;
}) {
  const resolvedVariant = variant ?? (tone === "light" ? "footer" : "header");
  const logo = logos[resolvedVariant];

  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2 rounded-lg",
        className,
      )}
      aria-label={`${siteConfig.brandName} home`}
    >
      <Image
        src={logo.src}
        alt={siteConfig.brandName}
        width={logo.width}
        height={logo.height}
        priority={resolvedVariant === "header"}
        className={cn(
          "w-auto object-contain",
          resolvedVariant === "footer"
            ? "h-14 sm:h-16"
            : "h-10 sm:h-12",
        )}
        sizes={
          resolvedVariant === "footer"
            ? "(max-width: 640px) 180px, 220px"
            : "(max-width: 640px) 160px, 200px"
        }
      />
    </Link>
  );
}
