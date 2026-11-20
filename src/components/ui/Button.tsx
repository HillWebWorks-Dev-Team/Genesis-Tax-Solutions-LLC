import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "outlineGold"
  | "ghost"
  | "gold";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-pink text-white hover:bg-brand-pink-dark shadow-sm shadow-brand-pink/25",
  secondary: "bg-brand-navy text-white hover:bg-brand-navy-light",
  outline:
    "border border-white/80 bg-transparent text-white hover:bg-white/10",
  outlineGold:
    "border border-brand-gold bg-transparent text-white hover:bg-brand-gold/10",
  ghost: "bg-transparent text-brand-navy hover:bg-brand-ivory",
  gold: "bg-brand-gold text-brand-navy hover:bg-brand-gold-light",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm sm:text-base",
  lg: "px-8 py-3.5 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  external?: boolean;
};

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const {
    variant = "primary",
    size = "md",
    className,
    children,
  } = props;

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );

  if ("href" in props && props.href) {
    const { href, external } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  const {
    type = "button",
    variant: _variant,
    size: _size,
    className: _className,
    children: _children,
    href: _href,
    ...rest
  } = props as ButtonAsButton & { href?: undefined };

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
