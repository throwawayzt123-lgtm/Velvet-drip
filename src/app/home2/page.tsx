import type { Metadata } from "next";

import CoffeeScrollHero from "@/components/sections/CoffeeScrollHero";
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
  title: `${BRAND.name} — The Pour`,
  description:
    "A scroll-driven cinematic pour: the cup lifts from the table, tilts, and empties toward you.",
};

/**
 * Same site, alternate opening. Only the hero differs — every section below it
 * is the component already used on the home page.
 */
export default function Home2() {
  return (
    <main>
      <CoffeeScrollHero />
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
