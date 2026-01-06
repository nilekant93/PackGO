import { Tabs } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { theme } from '../src/theme/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <PaperProvider theme={theme}>
      <Tabs
        screenOptions={{
          headerShown: true,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: '#BBBBBB',
          tabBarLabelStyle: { fontSize: 13 },
          tabBarStyle: { backgroundColor: theme.colors.surface },
          headerStyle: { backgroundColor: theme.colors.surface },
          headerTintColor: theme.colors.onSurface,
        }}
      >
        <Tabs.Screen
          name="01-Index"
          options={{
            title: 'Home',
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="create-trip"
          options={{
            title: 'Create Trip',
            tabBarLabel: 'Create Trip',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="plus-box-outline" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="your-stuff"
          options={{
            title: 'Your Stuff',
            tabBarLabel: 'Your Stuff',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="package-variant-closed" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </PaperProvider>
  );
}
