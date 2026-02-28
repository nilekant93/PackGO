import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Button, Checkbox, Divider, List, Text, useTheme } from "react-native-paper";
import { getTrips, upsertTrip, type Trip } from "../../src/storage/trips";

export default function TripChecklistScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const trips = await getTrips();
    const found = trips.find((t) => t.id === id) ?? null;
    setTrip(found);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const title = trip?.name ?? "Checklist";

  const isOneTime = trip?.mode === "oneTime";

  const totalCounts = useMemo(() => {
    if (!trip || trip.mode !== "oneTime") return { total: 0, checked: 0 };
    const items = trip.bags.flatMap((b) => b.items);
    const checked = items.filter((i) => i.checked).length;
    return { total: items.length, checked };
  }, [trip]);

  const toggleItem = async (bagId: string, itemId: string) => {
    if (!trip || trip.mode !== "oneTime") return;

    const next: Trip = {
      ...trip,
      updatedAtISO: new Date().toISOString(),
      bags: trip.bags.map((b) => {
        if (b.id !== bagId) return b;
        return {
          ...b,
          items: b.items.map((it) => (it.id === itemId ? { ...it, checked: !it.checked } : it)),
        };
      }),
    };

    setTrip(next);
    await upsertTrip(next);
  };

  const setAllInBag = async (bagId: string, value: boolean) => {
    if (!trip || trip.mode !== "oneTime") return;

    const next: Trip = {
      ...trip,
      updatedAtISO: new Date().toISOString(),
      bags: trip.bags.map((b) => {
        if (b.id !== bagId) return b;
        return {
          ...b,
          items: b.items.map((it) => ({ ...it, checked: value })),
        };
      }),
    };

    setTrip(next);
    await upsertTrip(next);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title,
          headerLeft: () => (
            <Button onPress={() => router.back()} textColor={theme.colors.onSurface}>
              Back
            </Button>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        {loading && <Text style={{ color: theme.colors.onSurface }}>Loading…</Text>}

        {!loading && !trip && (
          <View style={{ gap: 10 }}>
            <Text style={{ color: theme.colors.onSurface }}>Trip not found.</Text>
            <Button mode="contained" onPress={() => router.replace("/")} buttonColor={theme.colors.primary}>
              Go Home
            </Button>
          </View>
        )}

        {!loading && trip && trip.mode !== "oneTime" && (
          <Text style={{ color: theme.colors.onSurface }}>
            Routine trips checklist can be added next. (This screen currently supports one-time trips.)
          </Text>
        )}

        {!loading && trip && isOneTime && (
          <View style={{ gap: 14 }}>
            <View style={styles.headerBlock}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                {trip.name}
              </Text>

              <Text style={{ color: theme.colors.onSurfaceVariant }}>
                Packed {totalCounts.checked}/{totalCounts.total}
              </Text>

              <View style={{ height: 10 }} />
              <Divider />
            </View>

            {/* Bags */}
            <View style={{ gap: 10 }}>
              {trip.bags.map((bag) => {
                const bagTotal = bag.items.length;
                const bagChecked = bag.items.filter((i) => i.checked).length;

                return (
                  <List.Accordion
                    key={bag.id}
                    title={`${bag.name} (${bagChecked}/${bagTotal})`}
                    titleStyle={{ color: theme.colors.onSurface }}
                    style={[
                      styles.accordion,
                      { backgroundColor: theme.colors.surface, borderColor: "rgba(148,163,184,0.18)" },
                    ]}
                  >
                    <View style={styles.bagActionsRow}>
                      <Button
                        mode="outlined"
                        onPress={() => setAllInBag(bag.id, true)}
                        textColor={theme.colors.onSurface}
                        style={{ flex: 1 }}
                      >
                        Check all
                      </Button>
                      <Button
                        mode="outlined"
                        onPress={() => setAllInBag(bag.id, false)}
                        textColor={theme.colors.onSurface}
                        style={{ flex: 1, marginLeft: 10 }}
                      >
                        Uncheck all
                      </Button>
                    </View>

                    {bag.items.map((it) => (
                      <List.Item
                        key={it.id}
                        title={it.name}
                        titleStyle={{
                          color: theme.colors.onSurface,
                          textDecorationLine: it.checked ? "line-through" : "none",
                          opacity: it.checked ? 0.7 : 1,
                        }}
                        left={() => (
                          <Checkbox
                            status={it.checked ? "checked" : "unchecked"}
                            onPress={() => toggleItem(bag.id, it.id)}
                          />
                        )}
                        onPress={() => toggleItem(bag.id, it.id)}
                      />
                    ))}

                    {bag.items.length === 0 && (
                      <Text style={{ color: theme.colors.onSurfaceVariant, paddingHorizontal: 16, paddingBottom: 14 }}>
                        No items yet.
                      </Text>
                    )}
                  </List.Accordion>
                );
              })}
            </View>

            <View style={{ height: 12 }} />
            <Button mode="outlined" onPress={load} textColor={theme.colors.onSurface}>
              Refresh
            </Button>
          </View>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
 container: {
  padding: 16,
  paddingBottom: 28,
  flexGrow: 1,
  backgroundColor: "#0B1220",
},
  headerBlock: {
    gap: 4,
  },
  accordion: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  bagActionsRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
  },
});