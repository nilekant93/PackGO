import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Bag } from "../components/bags/types";

const KEY = "catalogue:bags:v1";

export async function getBags(): Promise<Bag[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Bag[]) : [];
  } catch {
    return [];
  }
}

export async function setBags(bags: Bag[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(bags));
}

export async function clearBags(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}