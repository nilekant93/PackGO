import React from "react";
import { StyleSheet, View, Image } from "react-native"; // Image for png icons
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import {
  BookOpen,
  Cable,
  Footprints,
  Headphones,
  KeyRound,
  Package,
  Pill,
  ScanText,
  Shirt,
  Smartphone,
  Wallet,
  Beer,
} from "lucide-react-native";

type LucideIconType = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type ItemIconLibrary = "lucide" | "mdi" | "fa5" | "image"; // added image for custom PNGs

export type ItemIconId =
  | "shirt"
  | "underwear"
  | "swimwear"
  | "socks"
  | "drink"
  | "toothbrush"
  | "jeans"              // custom PNG icon id
  | "towel"              // custom PNG icon id
  | "shorts"             // custom PNG icon id
  | "clothing"
  | "electronics"
  | "charger"
  | "keys"
  | "wallet"
  | "book"
  | "medicine"
  | "document"
  | "headphones"
  | "toiletry"
  | "shoes"
  | "misc";

type ItemIconDefinition =
  | {
      library: "lucide";
      Icon: LucideIconType;
      keywords: string[];
    }
  | {
      library: "mdi";
      iconName: string;
      keywords: string[];
    }
  | {
      library: "fa5";
      iconName: string;
      keywords: string[];
    }
  | {
      library: "image";               // custom PNG
      source: any; /* require(...) */
      keywords: string[];
    }; 

const ITEM_ICONS: Record<ItemIconId, ItemIconDefinition> = {
  shirt: {
    library: "lucide",
    Icon: Shirt,
    keywords: [
      "shirt",
      "t-shirt",
      "tee",
      "hoodie",
      "jacket",
      "coat",
      "paita",
      "huppari",
      "takki",
    ],
  },

  underwear: {
    library: "mdi",
    iconName: "underwear-outline",
    keywords: [
      "underwear",
      "boxers",
      "briefs",
      "bra",
      "panties",
      "alushousut",
      "alusvaatteet",
      "bokserit",
      "rintaliivit",
    ],
  },

  swimwear: {
    library: "fa5",
    iconName: "swimmer",
    keywords: [
      "swimsuit",
      "swimwear",
      "bikini",
      "swim shorts",
      "swimming",
      "uimapuku",
      "bikinit",
      "uikkarit",
      "uimashortsit",
      "speedo",
      "speedos",
    ],
  },

  socks: {
    library: "fa5",
    iconName: "socks",
    keywords: ["sock", "socks", "sukat"],
  },

  toothbrush: {
    library: "mdi",
    iconName: "toothbrush",
    keywords: ["toothbrush", "hammasharja"],
  },

  // custom entries for newly added PNGs – placed before clothing so they take precedence
  jeans: {
    library: "image",
    source: require("../../../assets/iconsforitems/jeans.png"),
    keywords: ["jeans", "trousers", "pants", "housut"],
  },

  towel: {
    library: "image",
    source: require("../../../assets/iconsforitems/bath-towel.png"),
    keywords: ["towel", "blanket", "bath towel", "bath-towel"],
  },

  shorts: {
    library: "image",
    source: require("../../../assets/iconsforitems/shorts.png"),
    keywords: ["shorts"],
  },

  clothing: {
    library: "mdi",
    iconName: "hanger",
    keywords: [
      "pants",
      "trousers",
      // removed jeans/shorts to avoid accidental matches; covered by dedicated icons above
      "leggings",
      "dress",
      "skirt",
      "housut",
      "farkut",
      "leggingsit",
      "shortsit",
      "mekko",
      "hame",
    ],
  },

  electronics: {
    library: "lucide",
    Icon: Smartphone,
    keywords: [
      "phone",
      "iphone",
      "android",
      "tablet",
      "ipad",
      "camera",
      "gopro",
      "smartphone",
      "puhelin",
      "tabletti",
      "kamera",
      "laptop",
      "macbook",
      "tietokone",
    ],
  },

  charger: {
    library: "lucide",
    Icon: Cable,
    keywords: [
      "charger",
      "charging",
      "cable",
      "usb",
      "usb-c",
      "lightning",
      "adapter",
      "powerbank",
      "power bank",
      "laturi",
      "kaapeli",
      "adapteri",
      "virtapankki",
    ],
  },

  keys: {
    library: "lucide",
    Icon: KeyRound,
    keywords: ["key", "keys", "avaimet", "avain"],
  },

  wallet: {
    library: "lucide",
    Icon: Wallet,
    keywords: ["wallet", "card holder", "lompakko", "korttikotelo"],
  },

  book: {
    library: "lucide",
    Icon: BookOpen,
    keywords: ["book", "notebook", "kindle", "kirja", "vihko", "muistikirja"],
  },

  medicine: {
    library: "lucide",
    Icon: Pill,
    keywords: ["medicine", "meds", "pill", "tablets", "lääke", "laastari", "särkylääke"],
  },

  document: {
    library: "lucide",
    Icon: ScanText,
    keywords: [
      "passport",
      "ticket",
      "documents",
      "document",
      "boarding pass",
      "passi",
      "lippu",
      "asiakirjat",
      "dokumentit",
    ],
  },

  headphones: {
    library: "lucide",
    Icon: Headphones,
    keywords: ["headphones", "earbuds", "airpods", "kuulokkeet"],
  },

  toiletry: {
    library: "mdi",
    iconName: "bottle-wine-outline",
    keywords: [
      "toothpaste",
      "soap",
      "shampoo",
      "conditioner",
      "shower gel",
      "body wash",
      "deodorant",
      "makeup",
      "razor",
      "hammastahna",
      "saippua",
      "shampoo",
      "hoitoaine",
      "suihkusaippua",
      "deodorantti",
      "partahöylä",
    ],
  },

  shoes: {
    library: "lucide",
    Icon: Footprints,
    keywords: ["shoes", "sneakers", "boots", "sandals", "kengät", "lenkkarit", "saappaat"],
  },

  drink: {
    library: "lucide",
    Icon: Beer,
    keywords: [
      "beer",
      "olut",
      "oluet",
      "bira",
      "kalja",
      "kaljat",
      "lonkerot",
      "siiderit",
      "lonkero",
      "siideri",
    ],
  },

  misc: {
    library: "lucide",
    Icon: Package,
    keywords: [],
  },
};

function normalize(input: string) {
  return input.trim().toLowerCase();
}

export function getSuggestedItemIconId(name: string): ItemIconId {
  const value = normalize(name);

  for (const [id, def] of Object.entries(ITEM_ICONS) as [ItemIconId, ItemIconDefinition][]) {
    if (def.keywords.some((keyword) => value.includes(keyword))) {
      return id;
    }
  }

  return "misc";
}

export function RenderIcon({
  iconId,
  size,
  color,
}: {
  iconId?: string;
  size: number;
  color: string;
}) {
  const safeId: ItemIconId =
    iconId && iconId in ITEM_ICONS ? (iconId as ItemIconId) : "misc";

  const def = ITEM_ICONS[safeId];

  if (def.library === "mdi") {
    return (
      <MaterialCommunityIcons
        name={def.iconName as React.ComponentProps<typeof MaterialCommunityIcons>["name"]}
        size={size}
        color={color}
      />
    );
  }

  if (def.library === "fa5") {
    return (
      <FontAwesome5
        name={def.iconName as React.ComponentProps<typeof FontAwesome5>["name"]}
        size={size}
        color={color}
        solid
      />
    );
  }

  if (def.library === "image") {
    // local PNG asset; tintColor ensures icon follows requested color
    return (
      <Image
        source={def.source}
        style={{ width: size, height: size, resizeMode: "contain", tintColor: color }}
      />
    );
  }

  const Icon = def.Icon;
  return <Icon size={size} color={color} strokeWidth={1.9} />;
}

export function ItemIconBadge({
  iconId,
  size = 16,
}: {
  iconId?: string;
  size?: number;
}) {
  return (
    <View style={styles.badge}>
      <RenderIcon iconId={iconId} size={size} color="#FFFFFF" />
    </View>
  );
}

export function ItemIconLarge({
  iconId,
  size = 28,
  noBackground = false,
}: {
  iconId?: string;
  size?: number;
  noBackground?: boolean;
}) {
  return (
    <View style={styles.largeBadge}>
      <RenderIcon iconId={iconId} size={size} color="#FFFFFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(148,163,184,0.10)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
  },
  largeBadge: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(34,211,238,0.12)",
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.22)",
  },
});