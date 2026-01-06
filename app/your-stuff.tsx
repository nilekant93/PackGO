import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function YourStuff() {
  return (
    <View style={styles.container}>
      <Text variant="headlineSmall">Your Stuff</Text>
      <Text>List your personal items here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
