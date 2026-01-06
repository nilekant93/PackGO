import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function CreateTrip() {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Create Trip</Text>
      <Text>Here you can create a new trip</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
