import { useCallback, useEffect, useRef, useState } from "react";
import type { Bag } from "../components/bags/types";
import { getBags, setBags as persistBags } from "../storage/bagsStorage";

export function useBags() {
  const [bags, setBags] = useState<Bag[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const didHydrate = useRef(false);

  const refresh = useCallback(async () => {
    const loaded = await getBags();
    setBags(loaded);

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
    persistBags(bags).catch(() => {});
  }, [bags]);

  const addBag = (bag: Bag) => {
    setBags((prev) => [bag, ...prev]);
  };

  const updateBag = (id: string, updates: Partial<Bag>) => {
    setBags((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const removeBag = (id: string) => {
    setBags((prev) => prev.filter((b) => b.id !== id));
  };

  return {
    bags,
    isHydrated,
    refresh,
    addBag,
    updateBag,
    removeBag,
    setBags,
  };
}