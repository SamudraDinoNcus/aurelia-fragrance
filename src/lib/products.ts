export interface MockProduct {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: "floral" | "oriental" | "fresh" | "woody";
  categorySlug: string;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  topNotes: string[];
  middleNotes: string[];
  baseNotes: string[];
  images: string[];
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "1",
    slug: "midnight-rose",
    name: "Midnight Rose",
    tagline: "A captivating floral embrace",
    description:
      "A captivating floral fragrance that unfolds like a midnight garden in full bloom. Bulgarian rose absolute meets velvety patchouli for an unforgettable impression.",
    price: 185,
    category: "floral",
    categorySlug: "floral",
    isBestSeller: true,
    isLimitedEdition: false,
    topNotes: ["Bergamot", "Pink Pepper", "Blackcurrant"],
    middleNotes: ["Bulgarian Rose", "Jasmine", "Iris"],
    baseNotes: ["Patchouli", "Amber", "Musk"],
    images: [],
  },
  {
    id: "2",
    slug: "amber-velvet",
    name: "Amber Velvet",
    tagline: "Warmth wrapped in elegance",
    description:
      "Wrap yourself in warmth with Amber Velvet. Rich amber resin blended with vanilla and sandalwood creates a velvety trail that lingers.",
    price: 210,
    compareAtPrice: 250,
    category: "oriental",
    categorySlug: "oriental",
    isBestSeller: true,
    isLimitedEdition: false,
    topNotes: ["Cinnamon", "Saffron", "Cardamom"],
    middleNotes: ["Amber", "Vanilla", "Cedar"],
    baseNotes: ["Sandalwood", "Benzoin", "Tonka"],
    images: [],
  },
  {
    id: "3",
    slug: "crystal-saffron",
    name: "Crystal Saffron",
    tagline: "Rare and luminous",
    description:
      "A luminous composition built around the world's most precious spice. Crystal Saffron shimmers with golden floralcy and a warm resinous base.",
    price: 195,
    category: "oriental",
    categorySlug: "oriental",
    isBestSeller: true,
    isLimitedEdition: false,
    topNotes: ["Saffron", "Neroli", "Mandarin"],
    middleNotes: ["Rose", "Orris", "Honey"],
    baseNotes: ["Ambergris", "Cedar", "Leather"],
    images: [],
  },
  {
    id: "4",
    slug: "ocean-silk",
    name: "Ocean Silk",
    tagline: "Fresh aquatic serenity",
    description:
      "Dive into serenity with Ocean Silk. A fresh aquatic breeze carrying white florals and clean musk — effortless sophistication for everyday.",
    price: 175,
    category: "fresh",
    categorySlug: "fresh",
    isBestSeller: true,
    isLimitedEdition: false,
    topNotes: ["Sea Salt", "Bergamot", "Lemon"],
    middleNotes: ["Lily of the Valley", "Rose", "Jasmine"],
    baseNotes: ["White Musk", "Amber", "Cedar"],
    images: [],
  },
  {
    id: "5",
    slug: "golden-oud",
    name: "Golden Oud",
    tagline: "Deep resinous sophistication",
    description:
      "The rarest agarwood meets golden amber in this opulent fragrance. Golden Oud is a statement of refined taste and timeless luxury.",
    price: 230,
    category: "oriental",
    categorySlug: "oriental",
    isBestSeller: true,
    isLimitedEdition: true,
    topNotes: ["Oud", "Saffron", "Bergamot"],
    middleNotes: ["Rose", "Cypriol", "Papyrus"],
    baseNotes: ["Amber", "Leather", "Sandalwood"],
    images: [],
  },
  {
    id: "6",
    slug: "luminous-jasmine",
    name: "Luminous Jasmine",
    tagline: "Delicate white floral notes",
    description:
      "A radiant tribute to jasmine in all its forms. Luminous Jasmine captures the flower at dawn — dewy, intoxicating, and gracefully bold.",
    price: 190,
    category: "floral",
    categorySlug: "floral",
    isBestSeller: true,
    isLimitedEdition: false,
    topNotes: ["Mandarin", "Pear", "Bergamot"],
    middleNotes: ["Jasmine", "Ylang-Ylang", "Orange Blossom"],
    baseNotes: ["Musk", "Sandalwood", "Vanilla"],
    images: [],
  },
  {
    id: "7",
    slug: "phantom-leather",
    name: "Phantom Leather",
    tagline: "Bold and enigmatic",
    description:
      "Bold, enigmatic, effortlessly cool. Phantom Leather weaves smoky birch tar with supple leather accord for a fragrance that commands attention.",
    price: 245,
    compareAtPrice: 290,
    category: "woody",
    categorySlug: "woody",
    isBestSeller: true,
    isLimitedEdition: false,
    topNotes: ["Birch", "Juniper", "Black Pepper"],
    middleNotes: ["Leather", "Violet", "Saffron"],
    baseNotes: ["Oud", "Patchouli", "Incense"],
    images: [],
  },
  {
    id: "8",
    slug: "silver-musk",
    name: "Silver Musk",
    tagline: "Clean modern minimalism",
    description:
      "Pure minimalism in a bottle. Silver Musk is a clean, contemporary skin scent built around translucent musks and soft aldehydes.",
    price: 200,
    category: "fresh",
    categorySlug: "fresh",
    isBestSeller: true,
    isLimitedEdition: false,
    topNotes: ["Aldehydes", "Pear", "Bergamot"],
    middleNotes: ["Musk", "Iris", "Lily of the Valley"],
    baseNotes: ["Ambroxan", "Cedar", "White Musk"],
    images: [],
  },
  {
    id: "9",
    slug: "noir-tobacco",
    name: "Noir Tobacco",
    tagline: "Dark and smoky allure",
    description:
      "An intoxicating blend of dark tobacco leaf, honeyed rum, and smoky woods. Noir Tobacco is for those who embrace the night.",
    price: 220,
    category: "woody",
    categorySlug: "woody",
    isBestSeller: false,
    isLimitedEdition: true,
    topNotes: ["Tobacco", "Rum", "Prune"],
    middleNotes: ["Leather", "Cinnamon", "Clove"],
    baseNotes: ["Birch", "Oud", "Vanilla"],
    images: [],
  },
  {
    id: "10",
    slug: "solar-neroli",
    name: "Solar Neroli",
    tagline: "Radiant Mediterranean bliss",
    description:
      "Capturing the essence of a sun-drenched Mediterranean garden. Solar Neroli sparkles with citrus brightness and a warm floral heart.",
    price: 180,
    category: "fresh",
    categorySlug: "fresh",
    isBestSeller: false,
    isLimitedEdition: false,
    topNotes: ["Neroli", "Bergamot", "Lemon"],
    middleNotes: ["Orange Blossom", "Jasmine", "Honeysuckle"],
    baseNotes: ["Musk", "Amber", "Cedar"],
    images: [],
  },
  {
    id: "11",
    slug: "velvet-iris",
    name: "Velvet Iris",
    tagline: "Powdery floral opulence",
    description:
      "Iris takes center stage in this powdered masterpiece. Velvet Iris wraps the regal orris root in soft suede and warm woods.",
    price: 235,
    compareAtPrice: 280,
    category: "floral",
    categorySlug: "floral",
    isBestSeller: false,
    isLimitedEdition: true,
    topNotes: ["Violet", "Bergamot", "Carrot Seed"],
    middleNotes: ["Iris", "Rose", "Heliotrope"],
    baseNotes: ["Suede", "Sandalwood", "Vanilla"],
    images: [],
  },
  {
    id: "12",
    slug: "ember-oud",
    name: "Ember Oud",
    tagline: "Smoldering embers and rare woods",
    description:
      "Like embers glowing in the dark, Ember Oud smolders with smoky agarwood, roasted coffee, and a whisper of vanilla.",
    price: 260,
    category: "woody",
    categorySlug: "woody",
    isBestSeller: false,
    isLimitedEdition: true,
    topNotes: ["Coffee", "Bergamot", "Saffron"],
    middleNotes: ["Oud", "Leather", "Cypriol"],
    baseNotes: ["Vanilla", "Amber", "Sandalwood"],
    images: [],
  },
  {
    id: "13",
    slug: "his-her",
    name: "His & Her",
    tagline: "A matching set of timeless elegance",
    description:
      "Midnight Rose and Phantom Leather presented together in a luxury gift box. The perfect gesture for two.",
    price: 340,
    compareAtPrice: 430,
    category: "oriental",
    categorySlug: "gift-sets",
    isBestSeller: false,
    isLimitedEdition: false,
    topNotes: ["Bergamot", "Pink Pepper", "Blackcurrant"],
    middleNotes: ["Rose", "Jasmine", "Leather"],
    baseNotes: ["Patchouli", "Amber", "Oud"],
    images: [],
  },
  {
    id: "14",
    slug: "the-explorer",
    name: "The Explorer",
    tagline: "Three signature scents in one set",
    description:
      "Travel-sized editions of Ocean Silk, Crystal Saffron, and Silver Musk in a curated discovery set.",
    price: 275,
    category: "fresh",
    categorySlug: "gift-sets",
    isBestSeller: false,
    isLimitedEdition: false,
    topNotes: ["Bergamot", "Sea Salt", "Saffron"],
    middleNotes: ["Lily of the Valley", "Rose", "Orris"],
    baseNotes: ["White Musk", "Amber", "Cedar"],
    images: [],
  },
  {
    id: "15",
    slug: "velvet-night",
    name: "Velvet Night",
    tagline: "An opulent evening collection",
    description:
      "Golden Oud, Amber Velvet, and Noir Tobacco in a handcrafted wooden case. For those who command the night.",
    price: 520,
    compareAtPrice: 680,
    category: "oriental",
    categorySlug: "gift-sets",
    isBestSeller: false,
    isLimitedEdition: true,
    topNotes: ["Oud", "Saffron", "Cinnamon"],
    middleNotes: ["Amber", "Rose", "Tobacco"],
    baseNotes: ["Leather", "Sandalwood", "Vanilla"],
    images: [],
  },
];

export function getProductBySlug(slug: string): MockProduct | undefined {
  return MOCK_PRODUCTS.find((p) => p.slug === slug);
}

export function getBestSellers(): MockProduct[] {
  return MOCK_PRODUCTS.filter((p) => p.isBestSeller);
}

export function getLimitedEdition(): MockProduct[] {
  return MOCK_PRODUCTS.filter((p) => p.isLimitedEdition);
}

export function getProductsByCategory(categorySlug: string): MockProduct[] {
  if (categorySlug === "all") return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((p) => p.categorySlug === categorySlug);
}

export function getGiftSets(): MockProduct[] {
  return MOCK_PRODUCTS.filter((p) => p.categorySlug === "gift-sets");
}

export const CATEGORIES = [
  { slug: "all", name: "All" },
  { slug: "floral", name: "Floral" },
  { slug: "oriental", name: "Oriental" },
  { slug: "fresh", name: "Fresh" },
  { slug: "woody", name: "Woody" },
];
