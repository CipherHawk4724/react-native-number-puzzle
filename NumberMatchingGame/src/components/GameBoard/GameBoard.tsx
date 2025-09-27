// src/components/GameBoard/GameBoard.tsx
import React, { useState, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { GameBoardProps, CellData } from '../../types/game.types';
import NumberCell from '../NumberCell/NumberCell';
import { generateInitialGrid, addNewRow, checkRemainingMoves } from '../../utils/gameLogic/gridGenerator';
import { isValidMatch } from '../../utils/gameLogic/matchChecker';
import { styles } from './GameBoard.styles';

const { width: screenWidth } = Dimensions.get('window');

const GameBoard: React.FC<GameBoardProps> = ({
  level = 1,
  onMatch,
  onNoMovesLeft,
  onBoardCleared,
}) => {
  const [grid, setGrid] = useState<CellData[][]>([]);
  const [selectedCell, setSelectedCell] = useState<CellData | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);

  // Initialize game board
  useEffect(() => {
    initializeGame();
  }, [level]);

  const initializeGame = () => {
    const newGrid = generateInitialGrid(level);
    setGrid(newGrid);
    setSelectedCell(null);
    setMatchedPairs(0);
  };

  const handleCellPress = (cell: CellData) => {
    // Ignore if cell is already matched
    if (cell.isMatched) return;

    // If no cell is selected, select this one
    if (!selectedCell) {
      setSelectedCell(cell);
      return;
    }

    // If same cell is clicked again, deselect it
    if (selectedCell.id === cell.id) {
      setSelectedCell(null);
      return;
    }

    // Check if the two cells form a valid match
    if (isValidMatch(selectedCell, cell, grid)) {
      // Valid match - mark both cells as matched
      const updatedGrid = grid.map(row =>
        row.map(c => {
          if (c.id === selectedCell.id || c.id === cell.id) {
            return { ...c, isMatched: true };
          }
          return c;
        })
      );

      setGrid(updatedGrid);
      setMatchedPairs(prev => prev + 1);
      setSelectedCell(null);
      
      // Notify parent component about the match
      onMatch?.(selectedCell, cell);

      // Check if board is cleared
      setTimeout(() => {
        const allMatched = updatedGrid.flat().every(cell => cell.isMatched);
        if (allMatched) {
          onBoardCleared?.();
        } else {
          // Check if no moves left
          const hasMoves = checkRemainingMoves(updatedGrid);
          if (!hasMoves) {
            onNoMovesLeft?.();
          }
        }
      }, 300);
    } else {
      // Invalid match - show animation and reset selection
      setSelectedCell(null);
      // Animation will be handled in NumberCell component
    }
  };

  const handleAddRow = () => {
    const newGrid = addNewRow(grid);
    setGrid(newGrid);
  };

  // Calculate cell size based on screen width and columns (9 columns)
  const cellSize = (screenWidth - 40) / 9; // 40 for padding

  const renderGrid = () => {
    return grid.map((row, rowIndex) => (
      <View key={`row-${rowIndex}`} style={styles.row}>
        {row.map((cell, cellIndex) => (
          <NumberCell
            key={cell.id}
            cell={cell}
            size={cellSize}
            isSelected={selectedCell?.id === cell.id}
            onPress={handleCellPress}
          />
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {renderGrid()}
      </View>
    </View>
  );
};

export default GameBoard;