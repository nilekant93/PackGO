import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Preset } from "../components/items/PresetCard";

const KEY = "catalogue:presets:v1";

export async function getPresets(): Promise<Preset[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Preset[]) : [];
  } catch {
    return [];
  }
}

export async function setPresets(presets: Preset[]): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(presets));
}

export async function clearPresets(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}