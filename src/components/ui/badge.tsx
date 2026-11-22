import { cn } from "@/lib/utils";

type Tone = "gold" | "success" | "danger" | "neutral" | "verified" | "dark";

const tones: Record<Tone, string> = {
  gold: "bg-gold/15 text-gold border-gold/40",
  success: "bg-gold/10 text-gold border-gold/30",
  danger: "bg-danger/10 text-danger border-danger/40",
  neutral: "bg-white/[0.05] text-line border-gold/20",
  verified: "bg-gold/10 text-gold border-gold/30",
  dark: "bg-espresso/90 text-white border-gold/25",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-eyebrow font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
