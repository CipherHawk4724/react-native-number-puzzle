// app/components/Grid/Row.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Cell from './Cell';
import { Cell as CellType } from '../../hooks/useGameState';

type Props = {
  row: CellType[];
  selectedCells: CellType[];
  onCellPress: (cell: CellType) => boolean | undefined;
};

export default function Row({ row, selectedCells, onCellPress }: Props) {
  return (
    <View style={styles.row}>
      {row.map(cell => (
        <Cell
          key={cell.id}
          cell={cell}
          onPress={onCellPress}
          isSelected={selectedCells.some(c => c.id === cell.id)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4,
  },
});
