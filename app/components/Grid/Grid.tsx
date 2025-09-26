// app/components/Grid/Grid.tsx
import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import Row from './Row';
import useGameState, { Cell as CellType } from '../../hooks/useGameState';

type Props = {
  rows?: number; // initial rows
  onMatch?: (cell: CellType) => void; // updated type
};

export default function Grid({ rows = 3, onMatch }: Props) {
  const {
    grid,
    selectedCells,
    selectCell,
    addRow,
    isLevelComplete,
  } = useGameState();

  // Handle cell press
  const handleCellPress = (cell: CellType) => {
    const matched = selectCell(cell);
    if (matched && onMatch) onMatch(cell); // pass cell to onMatch
    return matched;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.grid}>
        {grid.map((row, idx) => (
          <Row
            key={idx}
            row={row}
            selectedCells={selectedCells}
            onCellPress={handleCellPress}
          />
        ))}
      </ScrollView>

      {/* Add Row Button */}
      <TouchableOpacity style={styles.addButton} onPress={addRow}>
        <Text style={styles.addButtonText}>Add Row</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  grid: {
    justifyContent: 'center',
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
