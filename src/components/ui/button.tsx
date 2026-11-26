import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-center font-semibold transition-all duration-300 ease-smooth hover:-translate-y-px motion-reduce:transform-none disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold select-none [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary:
    "bg-primary text-white border border-primary hover:border-primary-deep hover:bg-primary-deep active:scale-[0.98]",
  secondary:
    "bg-surface text-primary border border-line hover:bg-cream active:scale-[0.98]",
  ghost:
    "bg-transparent text-primary hover:bg-primary/5 active:scale-[0.98]",
  outline:
    "border border-line text-primary hover:border-gold hover:bg-gold/10 active:scale-[0.98]",
  light:
    "bg-cream text-primary border border-line hover:bg-surface active:scale-[0.98]",
  danger:
    "bg-deep text-danger border border-danger/40 hover:border-danger hover:bg-espresso active:scale-[0.98]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-nav",
  md: "h-11 px-5 text-nav sm:px-6",
  lg: "h-12 px-5 text-nav sm:px-7",
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
