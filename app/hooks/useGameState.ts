// app/hooks/useGameState.ts
import { useState, useEffect } from 'react';
import { shuffleArray, isMatch, randomFromArray } from '../utils/helpers';
import { LEVELS } from '../constants/gameConfig';

export type Cell = {
  id: string;
  value: number;
  matched: boolean;
};

export type GridRow = Cell[];

export default function useGameState() {
  // Level state
  const [level, setLevel] = useState(1);

  // Grid state: array of rows
  const [grid, setGrid] = useState<GridRow[]>([]);

  // Selected cells (max 2)
  const [selectedCells, setSelectedCells] = useState<Cell[]>([]);

  /** Initialize grid on level start */
  const initGrid = (lvl: number) => {
    const config = LEVELS[lvl - 1];
    const newGrid: GridRow[] = [];

    for (let i = 0; i < config.rows; i++) {
      const row: GridRow = [];
      for (let j = 0; j < config.columns; j++) {
        const value = randomFromArray(config.numbers);
        row.push({
          id: `${i}-${j}-${Math.random()}`,
          value,
          matched: false,
        });
      }
      newGrid.push(row);
    }

    // Optionally shuffle rows for randomness
    setGrid(shuffleArray(newGrid));
    setSelectedCells([]);
  };

  // Initialize grid on mount or level change
  useEffect(() => {
    initGrid(level);
  }, [level]);

  /** Handle cell selection */
  const selectCell = (cell: Cell) => {
    if (cell.matched) return; // ignore already matched
    if (selectedCells.length === 0) {
      setSelectedCells([cell]);
      return;
    } else if (selectedCells.length === 1) {
      const first = selectedCells[0];

      // Check match rule using helper
      const matched = isMatch(first.value, cell.value);

      const newGrid = grid.map(row =>
        row.map(c => {
          if (c.id === first.id || c.id === cell.id) {
            return { ...c, matched: matched ? true : c.matched };
          }
          return c;
        })
      );

      setGrid(newGrid);
      setSelectedCells([]);

      // Return match result for feedback
      return matched;
    }
  };

  /** Add new row dynamically */
  const addRow = () => {
    const config = LEVELS[level - 1];
    const newRow: GridRow = [];

    for (let j = 0; j < config.columns; j++) {
      const value = randomFromArray(config.numbers);
      newRow.push({
        id: `new-${Math.random()}`,
        value,
        matched: false,
      });
    }

    setGrid(prev => [...prev, newRow]);
  };

  /** Move to next level */
  const nextLevel = () => {
    if (level < LEVELS.length) {
      setLevel(prev => prev + 1);
    } else {
      console.log('All levels completed');
    }
  };

  /** Check if level is complete */
  const isLevelComplete = () => {
    return grid.every(row => row.every(cell => cell.matched));
  };

  return {
    grid,
    level,
    selectedCells,
    selectCell,
    addRow,
    nextLevel,
    isLevelComplete,
    initGrid,
    setLevel, // expose for reset
  };
}
