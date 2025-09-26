// app/_layout.tsx
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import GameScreen from './screens/GameScreen';

export default function Layout() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <GameScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Default background, can customize via theme
  },
});
