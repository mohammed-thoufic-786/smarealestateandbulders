import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { Founder } from "@/components/home/founder";
import { SuccessInNumbers } from "@/components/home/success-in-numbers";
import { FeaturedProperties } from "@/components/home/featured-properties";
import { ExploreByType } from "@/components/home/explore-by-type";
import { ExploreByLocation } from "@/components/home/explore-by-location";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { AvailabilityOfLoans } from "@/components/home/learn";
import { Testimonials } from "@/components/home/testimonials";
import { FinalCta } from "@/components/home/final-cta";
import { AboutUs } from "@/components/home/about-us";
import { StoryCommitment } from "@/components/home/story-commitment";
import { site } from "@/lib/site";
import styles from "./home.module.css";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className={styles.home}>
      {/* 01 */} <Hero />
      {/* 02 */} <Founder />
      {/* 03 */} <SuccessInNumbers />
      {/* 04 */} <FeaturedProperties />
      {/* 05 */} <ExploreByType />
      {/* 06 */} <ExploreByLocation />
      {/* 07 */} <WhyChooseUs />
      {/* 08 */} <AvailabilityOfLoans />
      {/* 09 */} <Testimonials />
      {/* 10 */} <FinalCta />
      {/* 11 */} <AboutUs />
      {/* 12 */} <StoryCommitment />
    </main>
  );
}
