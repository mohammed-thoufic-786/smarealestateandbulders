"use client";

import dynamic from "next/dynamic";

const MapEmbed = dynamic(
  () => import("@/components/property/map-embed").then((module) => module.MapEmbed),
  {
    ssr: false,
    loading: () => <div className="aspect-[16/10] w-full animate-pulse bg-ivory-200" aria-hidden="true" />,
  },
);

export function LazyContactMap({ src, title }: { src: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gold/25">
      <MapEmbed
        src={src}
        title={title}
        className="aspect-[16/10] w-full max-w-full grayscale-[0.3]"
      />
    </div>
  );
}
