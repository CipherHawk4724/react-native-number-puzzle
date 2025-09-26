// app/components/Grid/Cell.tsx
import React, { useState, useEffect, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Cell as CellType } from '../../hooks/useGameState';
import * as Animatable from 'react-native-animatable';

type Props = {
  cell: CellType;
  onPress: (cell: CellType) => boolean | undefined; // returns true if matched
  isSelected: boolean;
};

export default function Cell({ cell, onPress, isSelected }: Props) {
  const [fadeAnim] = useState(new Animated.Value(1));
  const animRef = useRef<Animatable.View & any>(null); // ref for Animatable

  // Fade matched cell
  useEffect(() => {
    if (cell.matched) {
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [cell.matched]);

  // Handle press
  const handlePress = () => {
    if (cell.matched) return;

    const isMatch = onPress(cell);
    if (isMatch === false && animRef.current) {
      // Invalid match: shake animation
      animRef.current.shake(500);
    }
  };

  return (
    <Animatable.View ref={animRef} style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        onPress={handlePress}
        style={[styles.cell, isSelected && styles.selectedCell]}
      >
        <Text style={styles.cellText}>{cell.value}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 60,
    height: 60,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCell: {
    backgroundColor: '#a0d8f0',
  },
  cellText: {
    fontSize: 20,
    fontWeight: '600',
  },
});
