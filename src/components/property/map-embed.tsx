"use client";

export function MapEmbed({
  src,
  title,
  className = "aspect-[16/9] w-full grayscale-[0.3]",
}: {
  src: string;
  title: string;
  className?: string;
}) {
  return (
    <iframe
      title={title}
      src={src}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      className={className}
      style={{ border: 0 }}
    />
  );
}
