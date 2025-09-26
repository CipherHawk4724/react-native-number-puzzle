// app/screens/GameScreen.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Header from '../components/Header/Header';
import Grid from '../components/Grid/Grid';
import Overlay from '../components/Overlay/Overlay';
import useGameState, { Cell as CellType } from '../hooks/useGameState';
import useTimer from '../hooks/useTimer';

export default function GameScreen() {
  // Game state hook
  const {
    level,
    selectCell,
    addRow,
    nextLevel,
    isLevelComplete,
    setLevel,
  } = useGameState();

  // Score state
  const [score, setScore] = React.useState(0);

  // Overlay state
  const [showOverlay, setShowOverlay] = React.useState(false);
  const [overlayText, setOverlayText] = React.useState('');

  // Timer hook (2 minutes per level)
  const { timeLeft, start, reset } = useTimer(120, () => {
    setOverlayText('Time Up!');
    setShowOverlay(true);
  });

  // Start timer on level start
  useEffect(() => {
    start();
  }, [level]);

  // Handle cell press
  const handleCellPress = (cell: CellType) => {
    const isMatch = selectCell(cell);
    if (isMatch) setScore(prev => prev + 10);

    // Check if level complete
    if (isLevelComplete()) {
      setOverlayText('Level Complete!');
      setShowOverlay(true);
      reset(120); // reset timer for next level
    }

    return isMatch;
  };

  // Overlay action: retry or next level
  const handleOverlayAction = () => {
    setShowOverlay(false);

    if (overlayText === 'Level Complete!') {
      setScore(0);
      nextLevel();
    } else {
      // Retry current level
      setScore(0);
      setLevel(level); // re-init grid
    }

    reset(120); // restart timer
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header level={level} score={score} timeLeft={timeLeft} />

      {/* Grid */}
      <Grid onMatch={handleCellPress} />

      {/* Add Row Button */}
      <TouchableOpacity style={styles.addButton} onPress={addRow}>
        <Text style={styles.addButtonText}>Add Row</Text>
      </TouchableOpacity>

      {/* Overlay */}
      {showOverlay && (
        <Overlay text={overlayText} onPress={handleOverlayAction} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  addButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
