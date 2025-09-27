// src/utils/constants/gameConfig.ts
export const GAME_CONFIGS = {
  1: {
    name: 'Easy',
    gridRows: 3,
    gridCols: 9,
    numbersRange: [1, 9] as [number, number],
    maxConnections: 1,
    targetMatches: 10,
    timeLimit: 600, // 10 minutes
  },
  2: {
    name: 'Medium',
    gridRows: 4,
    gridCols: 9,
    numbersRange: [1, 9] as [number, number],
    maxConnections: 2,
    targetMatches: 15,
    timeLimit: 480, // 8 minutes
  },
  3: {
    name: 'Hard',
    gridRows: 5,
    gridCols: 9,
    numbersRange: [1, 9] as [number, number],
    maxConnections: 3,
    targetMatches: 20,
    timeLimit: 360, // 6 minutes
  },
};

export const GAME_CONSTANTS = {
  ADD_ROW_COST: 50,
  SHUFFLE_COST: 25,
  HINT_COST: 10,
  MAX_HINTS: 3,
  MATCH_POINTS: 10,
  BONUS_POINTS: 100,
  TIME_BONUS_MULTIPLIER: 1,
};