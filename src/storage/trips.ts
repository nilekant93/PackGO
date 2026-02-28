import AsyncStorage from "@react-native-async-storage/async-storage";

export type TripItem = {
  id: string;
  name: string;
  checked: boolean;
};

export type TripBag = {
  id: string;
  name: string;
  type: string;
  imageId?: string;
  items: TripItem[];
};

export type TripMode = "oneTime" | "routine";

export type OneTimeTrip = {
  id: string;
  mode: "oneTime";
  name: string;

  startDateISO: string; // ISO
  endDateISO?: string;  // ISO optional when no return
  hasReturn: boolean;

  transportModes: string[];
  tripTypesSelected: string[];

  bags: TripBag[];

  createdAtISO: string;
  updatedAtISO: string;
};

export type RoutineTrip = {
  id: string;
  mode: "routine";
  name: string;
  kinds: string[];
  items: TripItem[];

  createdAtISO: string;
  updatedAtISO: string;
};

export type Trip = OneTimeTrip | RoutineTrip;

const KEY = "TRIPS_V1";

async function readAll(): Promise<Trip[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Trip[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(trips: Trip[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(trips));
}

export async function getTrips(): Promise<Trip[]> {
  return readAll();
}

export async function upsertTrip(trip: Trip): Promise<void> {
  const trips = await readAll();
  const idx = trips.findIndex((t) => t.id === trip.id);
  const next = [...trips];

  if (idx >= 0) next[idx] = trip;
  else next.unshift(trip); // newest first

  await writeAll(next);
}

export async function deleteTrip(tripId: string): Promise<void> {
  const trips = await readAll();
  await writeAll(trips.filter((t) => t.id !== tripId));
}

export async function clearTrips(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}