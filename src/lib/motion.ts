import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const QUERY = "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)";

type Animatable = {
  kill: () => void;
  scrollTrigger?: ScrollTrigger;
};

export function initHomeMotion() {
  gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add(QUERY, () => {
    const animations: Animatable[] = [];
    const cleanups: Array<() => void> = [];

    const track = (animation: Animatable) => {
      animations.push(animation);
      if (animation.scrollTrigger) cleanups.push(() => animation.scrollTrigger?.kill());
      cleanups.push(() => animation.kill());
    };

    gsap.utils.toArray<HTMLElement>("[data-motion-heading-inner]").forEach((inner) => {
      const heading = inner.closest("[data-motion-heading]");
      track(
        gsap.fromTo(
          inner,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: { trigger: heading ?? inner, start: "top 85%", once: true },
          },
        ),
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-motion-cards]").forEach((group) => {
      const cards = Array.from(group.children) as HTMLElement[];
      if (!cards.length) return;
      track(
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          },
        ),
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-motion-tilt-group]").forEach((group) => {
      const cards = Array.from(group.children) as HTMLElement[];
      if (!cards.length) return;
      gsap.set(group, { perspective: 1000 });
      track(
        gsap.fromTo(
          cards,
          { rotateX: 14, y: 40, opacity: 0, transformOrigin: "center top" },
          {
            rotateX: 0,
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 85%", once: true },
          },
        ),
      );
    });

    gsap.utils.toArray<HTMLElement>("[data-motion-image]").forEach((image) => {
      const frame = image.parentElement;
      if (!frame) return;
      const timeline = gsap.timeline({
        scrollTrigger: { trigger: frame, start: "top 85%", once: true },
      });
      timeline
        .fromTo(
          frame,
          { clipPath: "inset(100% 0 0 0)" },
          { clipPath: "inset(0% 0 0 0)", duration: 0.9, ease: "power3.out" },
          0,
        )
        .fromTo(image, { scale: 1.15 }, { scale: 1, duration: 0.9, ease: "power3.out" }, 0);
      track(timeline);
    });

    const featuredSection = document.querySelector<HTMLElement>("[data-motion-featured-section]");
    const featuredTrack = document.querySelector<HTMLElement>("[data-motion-featured]");

    if (featuredSection && featuredTrack) {
      const distance = () => Math.max(0, featuredTrack.scrollWidth - featuredTrack.clientWidth);
      const horizontal = gsap.to(featuredTrack, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: featuredSection,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      track(horizontal);

      const onFocusIn = (event: FocusEvent) => {
        const trigger = horizontal.scrollTrigger;
        const total = distance();
        if (!trigger || total === 0) return;

        let card = event.target as HTMLElement | null;
        while (card && card.parentElement !== featuredTrack && card !== featuredTrack) {
          card = card.parentElement;
        }
        if (!card || card === featuredTrack) return;

        const desiredX = featuredTrack.clientWidth / 2 - (card.offsetLeft + card.offsetWidth / 2);
        const clampedX = Math.max(-total, Math.min(0, desiredX));
        const progress = -clampedX / total;
        window.scrollTo({ top: trigger.start + progress * (trigger.end - trigger.start) });
      };

      featuredTrack.addEventListener("focusin", onFocusIn);
      cleanups.push(() => featuredTrack.removeEventListener("focusin", onFocusIn));
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  });

  return () => mm.revert();
}
