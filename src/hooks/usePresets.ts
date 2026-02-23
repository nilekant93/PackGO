import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Preset } from "../components/items/PresetCard";
import { getPresets, setPresets as persistPresets } from "../storage/presetsStorage";

export function usePresets() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const didHydrate = useRef(false);

  const refresh = useCallback(async () => {
    const loaded = await getPresets();
    setPresets(loaded);
    if (!didHydrate.current) {
      didHydrate.current = true;
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!didHydrate.current) return;
    persistPresets(presets).catch(() => {});
  }, [presets]);

  const nextPresetNumber = useMemo(() => {
    const nums = presets
      .map((p) => {
        const m = p.name.match(/^Preset\s+(\d+)$/i);
        return m ? Number(m[1]) : null;
      })
      .filter((n): n is number => typeof n === "number" && !Number.isNaN(n));

    const max = nums.length ? Math.max(...nums) : 0;
    return max + 1;
  }, [presets]);

  const addPreset = () => {
    const id = String(Date.now());
    const newPreset: Preset = { id, name: `Preset ${nextPresetNumber}`, items: [] };
    setPresets((prev) => [newPreset, ...prev]);
    return id;
  };

  const removePreset = (id: string) => {
    setPresets((prev) => prev.filter((p) => p.id !== id));
  };

  const renamePreset = (id: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPresets((prev) => prev.map((p) => (p.id === id ? { ...p, name: trimmed } : p)));
  };

  const addItemToPreset = (presetId: string, item: string) => {
    const trimmed = item.trim();
    if (!trimmed) return;
    setPresets((prev) =>
      prev.map((p) => (p.id === presetId ? { ...p, items: [...p.items, trimmed] } : p))
    );
  };

  const removeItemFromPreset = (presetId: string, itemIndex: number) => {
    setPresets((prev) =>
      prev.map((p) =>
        p.id === presetId ? { ...p, items: p.items.filter((_, idx) => idx !== itemIndex) } : p
      )
    );
  };

  return {
    presets,
    isHydrated,
    refresh, // ✅ tärkein lisä
    addPreset,
    removePreset,
    renamePreset,
    addItemToPreset,
    removeItemFromPreset,
    setPresets,
  };
}