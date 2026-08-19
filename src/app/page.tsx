import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import Story from "@/components/sections/Story";
import Menu from "@/components/sections/Menu";
import Craft from "@/components/sections/Craft";
import Origins from "@/components/sections/Origins";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import Visit from "@/components/sections/Visit";

export default function Home() {
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
