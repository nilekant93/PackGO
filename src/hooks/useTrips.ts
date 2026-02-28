import { useCallback, useEffect, useState } from "react";
import type { Trip } from "../storage/trips";
import { getTrips } from "../storage/trips";

export function useTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  const refresh = useCallback(async () => {
    const data = await getTrips();
    setTrips(data);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { trips, isHydrated, refresh };
}