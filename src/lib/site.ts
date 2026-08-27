/** All copy + content for the site, kept out of the components. */

export const BRAND = {
  name: "Velvet Drip",
  tagline: "Coffee Atelier",
  established: "EST. SPECIALITY · 2016",
  address: "18 Marlowe Lane, Fitzrovia, London W1T",
  hours: "Mon–Fri 07:00–19:00 · Sat–Sun 08:00–18:00",
  phone: "+44 20 7946 0812",
  email: "contact@nofilter.coffee",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Story", href: "#story" },
  { label: "Menu", href: "#menu" },
  { label: "Craft", href: "#craft" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit", href: "#visit" },
] as const;

export const TICKER = [
  "Speciality Grade 88+",
  "Single Origin",
  "Slow Roasted Daily",
  "Q-Grader Baristas",
  "Direct Trade Origins",
  "Featured in Monocle",
] as const;

export type MenuCategory = "Espresso" | "Slow Brew" | "Patisserie";

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  price: string;
  image: string;
  blurb: string;
  notes: string[];
};

export const MENU: MenuItem[] = [
  {
    id: "cortado",
    name: "Velvet Cortado",
    category: "Espresso",
    price: "£4.20",
    image: "/images/menu/cortado.jpg",
    blurb:
      "A double ristretto cut with silk-textured milk, poured at precisely 62°C for a rounded, unhurried finish.",
    notes: ["Cocoa nib", "Hazelnut", "Brown sugar"],
  },
  {
    id: "ristretto",
    name: "Ristretto Nero",
    category: "Espresso",
    price: "£3.40",
    image: "/images/menu/ristretto.jpg",
    blurb:
      "Eighteen grams in, twenty-two out, twenty-six seconds. Dense, syrupy and unapologetically dark.",
    notes: ["Dark chocolate", "Fig", "Cedar"],
  },
  {
    id: "flat-white",
    name: "Atelier Flat White",
    category: "Espresso",
    price: "£4.60",
    image: "/images/menu/flat-white.jpg",
    blurb:
      "Our house blend beneath a mirror-smooth micro-foam, finished free-hand by a Q-graded barista.",
    notes: ["Toffee", "Almond", "Clove"],
  },
  {
    id: "cold-brew",
    name: "Barrel-Aged Cold Brew",
    category: "Slow Brew",
    price: "£5.80",
    image: "/images/menu/cold-brew.jpg",
    blurb:
      "Steeped eighteen hours, then rested a further six in oak. Poured over a single hand-cut clear cube.",
    notes: ["Oak", "Blackcurrant", "Vanilla"],
  },
  {
    id: "croissant",
    name: "Almond Croissant",
    category: "Patisserie",
    price: "£4.10",
    image: "/images/menu/croissant.jpg",
    blurb:
      "Seventy-two hour laminated dough, filled with Valencia almond cream and dusted the moment it leaves the oven.",
    notes: ["Butter", "Marzipan", "Sea salt"],
  },
  {
    id: "brownie",
    name: "Salt Caramel Brownie",
    category: "Patisserie",
    price: "£5.20",
    image: "/images/menu/brownie.jpg",
    blurb:
      "Single-estate 70% couverture, molten centre, warm salted caramel poured to order at the pass.",
    notes: ["Burnt sugar", "Cacao", "Cream"],
  },
];

export const MENU_CATEGORIES: Array<MenuCategory | "All"> = [
  "All",
  "Espresso",
  "Slow Brew",
  "Patisserie",
];

export const CRAFT_STEPS = [
  {
    index: "01",
    title: "Source",
    image: "/images/craft/source.jpg",
    body:
      "We buy two harvests ahead, direct from eleven farms. Every lot is cupped blind three times before a single sack crosses our door.",
    meta: "11 partner farms",
  },
  {
    index: "02",
    title: "Roast",
    image: "/images/craft/roast.jpg",
    body:
      "Twelve-kilo drum, profiled by hand. We chase clarity over caramel — the development window rarely runs past ninety seconds.",
    meta: "Roasted every morning",
  },
  {
    index: "03",
    title: "Extract",
    image: "/images/craft/extract.jpg",
    body:
      "Water re-mineralised to 78 ppm, baskets weighed to the tenth of a gram, every shot logged against the day's refractometer curve.",
    meta: "1:2.4 in 26 seconds",
  },
  {
    index: "04",
    title: "Serve",
    image: "/images/craft/serve.jpg",
    body:
      "Warmed porcelain, a glass of still water, and a table nobody will ask you to leave. The last ten seconds matter most.",
    meta: "No rush, ever",
  },
] as const;

export const ORIGINS = [
  { country: "Ethiopia", region: "Guji, Hambela", altitude: "2,050 m", process: "Natural" },
  { country: "Colombia", region: "Huila, Pitalito", altitude: "1,740 m", process: "Washed" },
  { country: "Kenya", region: "Nyeri, Karatina", altitude: "1,880 m", process: "Washed" },
  { country: "Guatemala", region: "Antigua", altitude: "1,600 m", process: "Honey" },
] as const;

export const GALLERY = [
  { src: "/images/gallery/interior-loft.jpg", caption: "The upper room", span: "tall" },
  { src: "/images/gallery/pour-milk.jpg", caption: "Morning pour", span: "short" },
  { src: "/images/gallery/lattes-plants.jpg", caption: "Window seats", span: "short" },
  { src: "/images/gallery/interior-bikes.jpg", caption: "The long bar", span: "tall" },
  { src: "/images/gallery/iced.jpg", caption: "Cold brew, no. 4", span: "tall" },
  { src: "/images/gallery/cake.jpg", caption: "Pastry counter", span: "short" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "The most considered cup in the city. Aurélia treats a twelve-minute coffee break like a tasting menu — and somehow never makes you feel hurried.",
    name: "Isabelle Moreau",
    role: "Editor, Monocle",
  },
  {
    quote:
      "I have been coming here every Thursday for four years. The room is beautiful, but it is the consistency that keeps the chairs full.",
    name: "Dr. Adeola Bankole",
    role: "Regular since 2021",
  },
  {
    quote:
      "Their barrel-aged cold brew is the single best thing I drank all year. Restrained, complex, and served with genuine warmth.",
    name: "Tomas Lindqvist",
    role: "Head Judge, Nordic Barista Cup",
  },
] as const;

export const STATS = [
  { value: "2016", label: "Established" },
  { value: "11", label: "Direct origins" },
  { value: "3", label: "Q-graders" },
  { value: "88+", label: "Cupping score" },
] as const;

/* ──────────────────────────────────────────────────────────────
   Home2 — scroll-driven coffee sequence
   ────────────────────────────────────────────────────────────── */

/**
 * The cinematic asset is an image sequence, not a video: 240 frames of
 * 1280×720 living in `public/Frames`. Scrubbing decoded JPEGs on a canvas is
 * frame-accurate and sidesteps the seek latency of `video.currentTime`.
 */
export const COFFEE_SEQUENCE = {
  path: (n: number) =>
    `/Frames/ezgif-frame-${String(n).padStart(3, "0")}.jpg`,
  first: 1,
  last: 240,
  width: 1280,
  height: 720,
} as const;

export type HeroBeat = {
  id: string;
  eyebrow: string;
  title: string;
  titleAccent?: string;
  titleTail?: string;
  body?: string;
  /** Timeline window as scroll progress: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] */
  window: [number, number, number, number];
};

/**
 * Copy beats timed against the footage. Frame landmarks, measured from the
 * sequence itself: cup leaves the table ~f45, tilt begins ~f85, the pour
 * starts ~f110, the camera drops under the stream ~f165.
 */
export const HERO_BEATS: HeroBeat[] = [
  {
    id: "lift",
    eyebrow: "01 — The Lift",
    title: "Nothing here is",
    titleAccent: "hurried",
    titleTail: ".",
    body: "Eighteen grams in, weighed to the tenth of a gram, and not a step skipped between.",
    window: [0.25, 0.31, 0.4, 0.45],
  },
  {
    id: "pour",
    eyebrow: "02 — The Pour",
    title: "Then it",
    titleAccent: "tips",
    titleTail: ".",
    body: "Twenty-two out, twenty-six seconds, and not a moment more.",
    window: [0.52, 0.58, 0.66, 0.71],
  },
  {
    id: "yours",
    eyebrow: "03 — Yours",
    title: "Poured with",
    titleAccent: "intent",
    titleTail: ".",
    window: [0.86, 0.92, 1.01, 1.02],
  },
];
