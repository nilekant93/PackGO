import type { CatalogItem } from "./types";
import type { BagType } from "../components/bags/types";

/**
 * Nämä stringit kannattaa pitää samoina kuin UI:ssa:
 * - Trip types: "Holiday Trip", "Work Trip", ...
 * - Transport: "Plane", "Train", ...
 */
const HOLIDAY = "Holiday Trip";
const WORK = "Work Trip";
const WEEKEND = "Weekend Trip";
const CAMPING = "Camping Trip";
const CITY = "City Break";

const PLANE = "Plane";
const TRAIN = "Train";
const CAR = "Car";
const BUS = "Bus";
const FERRY = "Ferry";
const BIKE = "Bike";
const WALKING = "Walking";
const OTHER = "Other";

const SUITCASE: BagType = "Suitcase";
const HAND: BagType = "Hand luggage";
const BACKPACK: BagType = "Backpack";
const TOILET: BagType = "Toilet bag";
const BAG_OTHER: BagType = "Other";

export const CATALOG: CatalogItem[] = [
  // --- Universal essentials ---
  {
    name: "Phone charger",
    basePriority: 8,
    universal: true,
    rules: [{ reason: "Common essential" }],
  },
  {
    name: "Power bank",
    basePriority: 7,
    universal: true,
    rules: [
      { transportModes: [PLANE, TRAIN, BUS], weight: 2, reason: "Useful during travel" },
      { bagTypes: [HAND, BACKPACK], weight: 2, reason: "Handy to keep close" },
    ],
  },
  {
    name: "Wallet",
    basePriority: 7,
    universal: true,
    rules: [{ bagTypes: [HAND, BACKPACK], weight: 2, reason: "Keep valuables close" }],
  },
  {
    name: "Medications",
    basePriority: 7,
    universal: true,
    rules: [{ reason: "Just in case" }],
  },
  {
    name: "Water bottle",
    basePriority: 6,
    universal: true,
    rules: [
      { bagTypes: [BACKPACK], weight: 2, reason: "Good for day use" },
      { tripTypes: [CAMPING], weight: 2, reason: "Important for outdoors" },
    ],
  },
  {
    name: "Snacks",
    basePriority: 5,
    universal: true,
    rules: [
      { transportModes: [PLANE, TRAIN, BUS, CAR], weight: 2, reason: "Good during travel" },
      { tripTypes: [WEEKEND], weight: 1, reason: "Easy to pack for short trips" },
    ],
  },
  {
    name: "Headphones",
    basePriority: 6,
    universal: true,
    rules: [{ transportModes: [PLANE, TRAIN, BUS], weight: 2, reason: "Comfort during travel" }],
  },

  // --- Plane / ID docs ---
  {
    name: "Passport / ID",
    basePriority: 9,
    rules: [
      { transportModes: [PLANE, FERRY, TRAIN], weight: 3, reason: "Often needed for travel" },
      { bagTypes: [HAND, BACKPACK], weight: 2, reason: "Keep it in carry-on" },
    ],
  },
  {
    name: "Boarding pass / tickets",
    basePriority: 7,
    rules: [{ transportModes: [PLANE, TRAIN, BUS, FERRY], weight: 3, reason: "Needed for boarding" }],
  },

  // --- Holiday / sun ---
  {
    name: "Sunglasses",
    basePriority: 6,
    rules: [
      { tripTypes: [HOLIDAY], weight: 2, reason: "Holiday essential" },
      { tripTypes: [CITY], weight: 1, reason: "Nice for city walks" },
      { bagTypes: [BACKPACK, HAND], weight: 1, reason: "Easy to carry" },
    ],
  },
  {
    name: "Sunscreen",
    basePriority: 6,
    rules: [{ tripTypes: [HOLIDAY], weight: 3, reason: "Protect your skin" }],
  },
  {
    name: "Swimwear",
    basePriority: 5,
    rules: [{ tripTypes: [HOLIDAY], weight: 3, reason: "Common for vacations" }],
  },

  // --- Work ---
  {
    name: "Laptop",
    basePriority: 6,
    rules: [
      { tripTypes: [WORK], weight: 3, reason: "Useful for work trips" },
      { bagTypes: [BACKPACK, HAND], weight: 2, reason: "Best in carry bag" },
    ],
  },
  {
    name: "Laptop charger",
    basePriority: 7,
    rules: [{ tripTypes: [WORK], weight: 3, reason: "Don’t forget charger" }],
  },
  {
    name: "Notebook & pen",
    basePriority: 4,
    rules: [{ tripTypes: [WORK], weight: 2, reason: "Handy for meetings" }],
  },

  // --- Clothing basics (suitcase) ---
  {
    name: "Underwear",
    basePriority: 6,
    rules: [{ bagTypes: [SUITCASE], weight: 3, reason: "Basics in suitcase" }],
  },
  {
    name: "Socks",
    basePriority: 6,
    rules: [{ bagTypes: [SUITCASE], weight: 3, reason: "Basics in suitcase" }],
  },
  {
    name: "T-shirts",
    basePriority: 5,
    rules: [{ bagTypes: [SUITCASE], weight: 2, reason: "Common clothing item" }],
  },

  // --- Toiletries (toilet bag / suitcase) ---
  {
    name: "Toothbrush",
    basePriority: 7,
    rules: [
      { bagTypes: [TOILET], weight: 4, reason: "Toiletry essential" },
      { bagTypes: [SUITCASE], weight: 2, reason: "Common hygiene item" },
    ],
  },
  {
    name: "Toothpaste",
    basePriority: 7,
    rules: [
      { bagTypes: [TOILET], weight: 4, reason: "Toiletry essential" },
      { bagTypes: [SUITCASE], weight: 2, reason: "Common hygiene item" },
    ],
  },
  {
    name: "Deodorant",
    basePriority: 6,
    rules: [
      { bagTypes: [TOILET], weight: 3, reason: "Toiletry essential" },
      { bagTypes: [SUITCASE], weight: 1, reason: "Good to pack" },
    ],
  },
  {
    name: "Shampoo",
    basePriority: 5,
    rules: [{ bagTypes: [TOILET], weight: 3, reason: "Toiletry essential" }],
  },

  // --- Camping ---
  {
    name: "Flashlight / headlamp",
    basePriority: 5,
    rules: [{ tripTypes: [CAMPING], weight: 4, reason: "Useful at night" }],
  },
  {
    name: "Rain jacket",
    basePriority: 5,
    rules: [
      { tripTypes: [CAMPING], weight: 3, reason: "Weather can change" },
      { transportModes: [WALKING, BIKE], weight: 2, reason: "Good for outdoors" },
    ],
  },

  // --- City break / casual ---
  {
    name: "Comfortable shoes",
    basePriority: 5,
    rules: [{ tripTypes: [CITY], weight: 3, reason: "Lots of walking" }],
  },

  // --- Other catch-all ---
  {
    name: "Reusable tote bag",
    basePriority: 3,
    rules: [{ bagTypes: [BAG_OTHER, BACKPACK], weight: 1, reason: "Handy extra space" }],
  },
];