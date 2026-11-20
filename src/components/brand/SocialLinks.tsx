import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

type IconProps = { className?: string };

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3.1l.9-3H13v-2c0-.6.4-1 1-1z" />
    </svg>
  );
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm10 2H7a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5zM17.5 7a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
    </svg>
  );
}

function SnapchatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12.04 2c-2.5 0-4.2 1.7-4.2 4.2v.5c-1.5.2-2.5 1-2.9 1.9-.2.5 0 1 .5 1.1.2 0 .4 0 .5-.1.1 1.3.9 2.2 1.8 2.9-.7.4-1.5.7-2.2 1.1-.5.3-.7.8-.5 1.3.2.5.7.8 1.3.7.9-.2 1.6-.5 2.3-.8.1 1.1.7 2 1.7 2.5.5.3 1.1.1 1.3-.4.1-.2.1-.4 0-.6-.2-.4-.3-.8-.3-1.2 0-.2.1-.3.3-.3.2 0 .3.1.3.3 0 .5.1 1 .4 1.4.2.3.6.4.9.2.9-.5 1.4-1.4 1.5-2.5.7.3 1.4.6 2.3.8.6.1 1.1-.2 1.3-.7.2-.5 0-1-.5-1.3-.7-.4-1.5-.7-2.2-1.1.9-.7 1.7-1.6 1.8-2.9.2.1.4.1.5.1.5-.1.7-.6.5-1.1-.4-.9-1.4-1.7-2.9-1.9v-.5C16.24 3.7 14.54 2 12.04 2z" />
    </svg>
  );
}

function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M19.6 8.2a6.7 6.7 0 0 1-3.9-1.2v7.1a5.6 5.6 0 1 1-4.8-5.5v2.9a2.8 2.8 0 1 0 2 2.7V2.5h2.7a3.9 3.9 0 0 0 3.9 3.9v1.8z" />
    </svg>
  );
}

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M17.7 3H20.5l-6.5 7.4L21.5 21h-5.3l-4.2-5.5L7.2 21H4.4l7-7.9L2.7 3h5.4l3.8 5 5.8-5zM16.8 19.3h1.5L7.4 4.6H5.8l11 14.7z" />
    </svg>
  );
}

const items = [
  { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "Snapchat", href: siteConfig.social.snapchat, Icon: SnapchatIcon },
  { label: "TikTok", href: siteConfig.social.tiktok, Icon: TikTokIcon },
  { label: "X", href: siteConfig.social.x, Icon: XIcon },
] as const;

export function SocialLinks({
  className,
  iconClassName,
  tone = "light",
}: {
  className?: string;
  iconClassName?: string;
  tone?: "light" | "dark" | "pink";
}) {
  const toneClass =
    tone === "dark"
      ? "text-brand-navy hover:text-brand-pink border-brand-navy/15 hover:border-brand-pink/40"
      : tone === "pink"
        ? "text-white hover:text-brand-gold border-white/25 hover:border-brand-gold/60"
        : "text-white hover:text-brand-gold border-white/20 hover:border-brand-gold/50";

  const tipClass =
    tone === "dark"
      ? "bg-brand-navy text-white"
      : "bg-white text-brand-navy";

  return (
    <ul className={cn("flex flex-wrap items-center gap-2.5", className)}>
      {items.map(({ label, href, Icon }) => (
        <li key={label} className="relative">
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit Genesis Tax & Notary Solutions on ${label}`}
            title={label}
            className={cn(
              "group relative inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors sm:h-10 sm:w-10",
              toneClass,
            )}
          >
            <Icon className={cn("h-4 w-4", iconClassName)} />
            <span
              className={cn(
                "pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100",
                tipClass,
              )}
            >
              {label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
