// src/utils/gameLogic/matchChecker.ts
import { CellData } from '../../../types/game.types';

export const isValidMatch = (cell1: CellData, cell2: CellData, grid: CellData[][]): boolean => {
  // Check if numbers can match (same or sum to 10)
  if (!canNumbersMatch(cell1.number, cell2.number)) {
    return false;
  }

  // Check if cells are connected in a straight line (horizontal, vertical, diagonal)
  return checkStraightLineConnection(cell1, cell2, grid);
};

export const canNumbersMatch = (num1: number, num2: number): boolean => {
  return num1 === num2 || num1 + num2 === 10;
};

const checkStraightLineConnection = (cell1: CellData, cell2: CellData, grid: CellData[][]): boolean => {
  const { row: row1, col: col1 } = cell1;
  const { row: row2, col: col2 } = cell2;

  // Check horizontal connection (same row)
  if (row1 === row2) {
    return checkHorizontalConnection(row1, col1, col2, grid);
  }

  // Check vertical connection (same column)
  if (col1 === col2) {
    return checkVerticalConnection(col1, row1, row2, grid);
  }

  // Check diagonal connection (45-degree angle)
  if (Math.abs(row1 - row2) === Math.abs(col1 - col2)) {
    return checkDiagonalConnection(cell1, cell2, grid);
  }

  return false;
};

const checkHorizontalConnection = (row: number, col1: number, col2: number, grid: CellData[][]): boolean => {
  const start = Math.min(col1, col2);
  const end = Math.max(col1, col2);

  for (let col = start + 1; col < end; col++) {
    const cell = grid[row]?.[col];
    if (cell && !cell.isMatched) {
      return false; // Path blocked by unmatched cell
    }
  }

  return true;
};

const checkVerticalConnection = (col: number, row1: number, row2: number, grid: CellData[][]): boolean => {
  const start = Math.min(row1, row2);
  const end = Math.max(row1, row2);

  for (let row = start + 1; row < end; row++) {
    const cell = grid[row]?.[col];
    if (cell && !cell.isMatched) {
      return false; // Path blocked by unmatched cell
    }
  }

  return true;
};

const checkDiagonalConnection = (cell1: CellData, cell2: CellData, grid: CellData[][]): boolean => {
  const { row: row1, col: col1 } = cell1;
  const { row: row2, col: col2 } = cell2;

  const rowStep = row1 < row2 ? 1 : -1;
  const colStep = col1 < col2 ? 1 : -1;

  let currentRow = row1 + rowStep;
  let currentCol = col1 + colStep;

  while (currentRow !== row2 && currentCol !== col2) {
    const cell = grid[currentRow]?.[currentCol];
    if (cell && !cell.isMatched) {
      return false; // Path blocked by unmatched cell
    }
    currentRow += rowStep;
    currentCol += colStep;
  }

  return true;
};