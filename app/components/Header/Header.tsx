// app/components/Header/Header.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  level: number;
  score: number;
  timeLeft: number; // in seconds
};

export default function Header({ level, score, timeLeft }: Props) {
  // Convert seconds to mm:ss
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Level: {level}</Text>
      <Text style={styles.text}>Score: {score}</Text>
      <Text style={styles.text}>Time: {formatTime(timeLeft)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
