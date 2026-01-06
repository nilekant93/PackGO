import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme } from 'react-native-paper';

export default function Home() {
  const theme = useTheme();

  const items = ['Laturi', 'Passi', 'Hammasharja', 'Pyyhe', 'Urheiluvaatteet'];

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text variant="headlineSmall" style={styles.title}>
        Final Check
      </Text>
      {items.map((item) => (
        <Card
          key={item}
          style={[styles.card, { backgroundColor: theme.colors.secondary }]}
        >
          <Card.Content>
            <Text style={{ color: theme.colors.onSurface, fontSize: 16 }}>{item}</Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              buttonColor={theme.colors.primary}
              textColor={theme.colors.onPrimary}
            >
              Mark as packed
            </Button>
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    marginBottom: 16,
    color: '#FFFFFF', // Teksti valkoiseksi headeriin
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
});
