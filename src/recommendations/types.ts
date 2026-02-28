import type { BagType } from "../components/bags/types";

export type TripMode = "oneTime" | "routine";

export type RecommendationContext = {
  mode?: TripMode | null;

  /** Nämä teillä on stringeillä (esim "Holiday Trip", "Work Trip") */
  tripTypesSelected?: string[];

  /** Nämä teillä on stringeillä (esim "Plane", "Train") */
  transportModes?: string[];

  /** Minkä bagin sisään ehdotetaan */
  bagType: BagType;

  /** Tulevaisuutta varten: jos haluat filtteröidä pois jo olemassa olevat */
  existingItemNames?: string[];
};

export type RecommendedItem = {
  name: string;

  /** score on sisäinen mutta voi olla hyödyllinen debuggaamiseen */
  score: number;

  /** UI:ssä näytettävä syy (yksi rivi) */
  reason?: string;

  /** Lisätietoa/selitys, voidaan näyttää myöhemmin */
  reasons?: string[];
};

export type CatalogItemRule = {
  /**
   * Jokainen match lisää pistettä.
   * Jos listat ovat tyhjiä/undefined, ei vaikuta.
   */
  tripTypes?: string[];
  transportModes?: string[];
  bagTypes?: BagType[];

  /** Lisäpainotus tälle matchille (default 1) */
  weight?: number;

  /** Kun tämä rule osuu, mikä syyteksti lisätään */
  reason?: string;
};

export type CatalogItem = {
  name: string;

  /** Yleinen tärkeys (0..10), vaikuttaa aina scoreen */
  basePriority?: number;

  /**
   * Säännöt joilla itemi “osuu” valintoihin.
   * Yksi item voi osua useammalla säännöllä.
   */
  rules?: CatalogItemRule[];

  /** Jos true, item kelpaa lähes aina (mutta basePriority määrää vahvuuden) */
  universal?: boolean;
};