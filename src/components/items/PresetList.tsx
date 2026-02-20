import React from "react";
import { View, FlatList } from "react-native";
import { Text } from "react-native-paper";

import PresetCard, { Preset } from "./PresetCard";
import GradientButton from "./GradientButton";

type Props = {
  presets: Preset[];
  expandedId: string | null;
  autoEditId: string | null;

  onAdd: () => void;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onConsumeAutoEdit: (id: string) => void;

  onAddItem: (presetId: string, item: string) => void;
  onRemoveItem: (presetId: string, itemIndex: number) => void;
};

export default function PresetList({
  presets,
  expandedId,
  autoEditId,
  onAdd,
  onToggle,
  onRemove,
  onRename,
  onConsumeAutoEdit,
  onAddItem,
  onRemoveItem,
}: Props) {
  return (
    <View style={{ gap: 10 }}>
      <Text style={{ color: "#CBD5E1", fontWeight: "900" }}>
        Your Presets ({presets.length})
      </Text>

      <FlatList
        data={presets}
        keyExtractor={(p) => p.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        renderItem={({ item }) => (
          <PresetCard
            preset={item}
            expanded={expandedId === item.id}
            autoEditName={autoEditId === item.id}
            onConsumeAutoEdit={() => onConsumeAutoEdit(item.id)}
            onToggle={() => onToggle(item.id)}
            onRemove={() => onRemove(item.id)}
            onRename={(name) => onRename(item.id, name)}
            onAddItem={(text) => onAddItem(item.id, text)}
            onRemoveItem={(index) => onRemoveItem(item.id, index)}
          />
        )}
      />

      <View style={{ marginTop: 4 }}>
        <GradientButton label="Add another preset" onPress={onAdd} />
      </View>
    </View>
  );
}