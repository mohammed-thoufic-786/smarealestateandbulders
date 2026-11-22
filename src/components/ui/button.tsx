import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-smooth disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-espresso text-gold border border-gold/40 hover:border-gold hover:bg-deep active:scale-[0.98]",
  secondary:
    "bg-cream text-espresso border border-line hover:bg-surface active:scale-[0.98]",
  ghost:
    "bg-transparent text-white hover:bg-white/[0.06] active:scale-[0.98]",
  outline:
    "border border-gold/45 text-white hover:border-gold hover:bg-gold/[0.08] active:scale-[0.98]",
  light:
    "bg-cream text-espresso border border-line hover:bg-surface active:scale-[0.98]",
  danger:
    "bg-deep text-danger border border-danger/40 hover:border-danger hover:bg-espresso active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-nav",
  md: "h-11 px-6 text-nav",
  lg: "h-12 px-8 text-nav py-3.5",
  icon: "h-10 w-10",
};

export function buttonVariants(opts?: { variant?: Variant; size?: Size; className?: string }) {
  return cn(base, variants[opts?.variant ?? "primary"], sizes[opts?.size ?? "md"], opts?.className);
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  ),
);
Button.displayName = "Button";
