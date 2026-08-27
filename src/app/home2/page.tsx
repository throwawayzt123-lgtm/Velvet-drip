import type { Metadata } from "next";

import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Story from "@/components/sections/Story";
import Menu from "@/components/sections/Menu";
import Craft from "@/components/sections/Craft";
import Origins from "@/components/sections/Origins";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import Visit from "@/components/sections/Visit";
import { BRAND } from "@/lib/site";

export const metadata: Metadata = {
  title: `${BRAND.name} — The Still Life`,
  description:
    "The composed opening: a single cup caught mid-pour, held against the dark.",
};

/**
 * Same site, alternate opening. Only the hero differs — every section below it
 * is the component already used on the home page.
 */
export default function Home2() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Story />
      <Menu />
      <Craft />
      <Origins />
      <Gallery />
      <Testimonials />
      <Visit />
    </main>
  );
}
