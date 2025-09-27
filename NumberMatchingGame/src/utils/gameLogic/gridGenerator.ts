// src/utils/gameLogic/gridGenerator.ts
import { CellData, GameConfig } from '../../../types/game.types';

// Game configurations for different levels
export const GAME_CONFIGS: Record<number, GameConfig> = {
  1: { gridRows: 3, gridCols: 9, numbersRange: [1, 9], maxConnections: 1 },
  2: { gridRows: 4, gridCols: 9, numbersRange: [1, 9], maxConnections: 2 },
  3: { gridRows: 5, gridCols: 9, numbersRange: [1, 9], maxConnections: 3 },
};

export const generateInitialGrid = (level: number): CellData[][] => {
  const config = GAME_CONFIGS[level];
  const grid: CellData[][] = [];
  const numbers: number[] = [];

  // Generate numbers for the grid (pairs that can match)
  for (let i = 0; i < config.gridRows * config.gridCols; i++) {
    // Random number between 1-9
    const num = Math.floor(Math.random() * 9) + 1;
    numbers.push(num);
  }

  // Create grid structure
  let cellId = 0;
  for (let row = 0; row < config.gridRows; row++) {
    const gridRow: CellData[] = [];
    for (let col = 0; col < config.gridCols; col++) {
      gridRow.push({
        id: `cell-${cellId++}`,
        number: numbers[row * config.gridCols + col],
        row,
        col,
        isMatched: false,
      });
    }
    grid.push(gridRow);
  }

  return grid;
};

export const addNewRow = (currentGrid: CellData[][]): CellData[][] => {
  if (currentGrid.length === 0) return currentGrid;

  const cols = currentGrid[0].length;
  const newRow: CellData[] = [];
  const startId = currentGrid.flat().length;

  // Create new row with random numbers
  for (let col = 0; col < cols; col++) {
    const num = Math.floor(Math.random() * 9) + 1;
    newRow.push({
      id: `cell-${startId + col}`,
      number: num,
      row: currentGrid.length,
      col,
      isMatched: false,
    });
  }

  return [...currentGrid, newRow];
};

export const checkRemainingMoves = (grid: CellData[][]): boolean => {
  const activeCells = grid.flat().filter(cell => !cell.isMatched);
  
  // Check all possible pairs
  for (let i = 0; i < activeCells.length; i++) {
    for (let j = i + 1; j < activeCells.length; j++) {
      const cell1 = activeCells[i];
      const cell2 = activeCells[j];
      
      // Simple check - in real implementation, check connectivity
      const canMatch = (cell1.number === cell2.number) || (cell1.number + cell2.number === 10);
      
      if (canMatch) {
        // Add proper path checking here later
        return true;
      }
    }
  }
  
  return false;
};