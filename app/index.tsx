import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { Button, Card, Text } from "react-native-paper";

import { useTrips } from "../src/hooks/useTrips";
import { deleteTrip } from "../src/storage/trips";
import ConfirmDeleteTripModal from "../src/components/home/ConfirmDeleteTripModal";

export default function Home() {
  const router = useRouter();
  const { trips, isHydrated, refresh } = useTrips();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState<string>("");

  const openTrip = (id: string) => {
    router.push({
      pathname: "/trip/[id]",
      params: { id },
    });
  };

  const askDelete = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    await deleteTrip(deleteTargetId);
    setDeleteOpen(false);
    setDeleteTargetId(null);
    setDeleteTargetName("");
    refresh();
  };

  const emptyCard = useMemo(
    () => (
      <View style={styles.emptyWrap}>
        <Text style={styles.emptyTitle}>No trips yet</Text>
        <Text style={styles.emptySub}>
          Create your first trip from the “Create Trip” tab.
        </Text>
      </View>
    ),
    []
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topRow}>
        <View>
          <Text variant="headlineSmall" style={styles.title}>
            Your Trips
          </Text>
          <Text style={styles.subtitle}>Open a trip to start packing.</Text>
        </View>

        <Button
          mode="outlined"
          onPress={refresh}
          textColor="#E2E8F0"
          style={styles.refreshBtn}
        >
          Refresh
        </Button>
      </View>

      {!isHydrated && <Text style={styles.muted}>Loading…</Text>}

      {isHydrated && trips.length === 0 && (
        <Card style={styles.card}>
          <Card.Content>{emptyCard}</Card.Content>
        </Card>
      )}

      {trips.map((t) => {
        const meta =
          t.mode === "oneTime"
            ? `${t.bags.length} bag(s) • ${t.transportModes.join(", ") || "—"}`
            : `Routine`;

        return (
          <Card key={t.id} style={styles.card} onPress={() => openTrip(t.id)}>
            <Card.Content>
              <Text style={styles.tripName}>{t.name}</Text>
              <Text style={styles.tripMeta}>{meta}</Text>

              {t.mode === "oneTime" && (
                <Text style={styles.tripMeta2}>
                  {t.tripTypesSelected.join(", ") || "—"}
                </Text>
              )}
            </Card.Content>

            <Card.Actions style={styles.actions}>
              <Button
                mode="contained"
                buttonColor="#22D3EE"
                textColor="#0B1220"
                onPress={() => openTrip(t.id)}
              >
                Open
              </Button>

              <Button
                mode="outlined"
                textColor="#FCA5A5"
                style={styles.deleteBtn}
                onPress={() => askDelete(t.id, t.name)}
              >
                Delete
              </Button>
            </Card.Actions>
          </Card>
        );
      })}

      <ConfirmDeleteTripModal
        visible={deleteOpen}
        tripName={deleteTargetName || "this trip"}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 28,
    flexGrow: 1,
    backgroundColor: "#0B1220",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 14,
    gap: 12,
  },

  title: { color: "#FFFFFF", fontWeight: "800" },
  subtitle: { color: "rgba(255,255,255,0.75)", marginTop: 4, fontSize: 12 },
  muted: { color: "#94A3B8" },

  refreshBtn: {
    borderColor: "rgba(148,163,184,0.35)",
    borderWidth: 1,
    borderRadius: 12,
  },

  card: {
    marginBottom: 12,
    borderRadius: 18,
    backgroundColor: "rgba(148,163,184,0.08)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.18)",
    overflow: "hidden",
  },

  tripName: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "900",
  },

  tripMeta: {
    color: "#94A3B8",
    marginTop: 6,
    fontSize: 13,
  },

  tripMeta2: {
    color: "rgba(148,163,184,0.9)",
    marginTop: 4,
    fontSize: 12,
  },

  actions: {
    paddingHorizontal: 8,
    paddingBottom: 8,
    justifyContent: "space-between",
  },

  deleteBtn: {
    borderColor: "rgba(248,113,113,0.35)",
    borderWidth: 1,
    borderRadius: 12,
  },

  emptyWrap: { gap: 6 },
  emptyTitle: { color: "#E2E8F0", fontWeight: "800", fontSize: 14 },
  emptySub: { color: "#94A3B8", fontSize: 12, lineHeight: 16 },
});