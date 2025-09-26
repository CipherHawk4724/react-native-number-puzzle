// app/constants/gameConfig.ts

export type LevelConfig = {
  rows: number;
  columns: number;
  numbers: number[]; // possible numbers for this level
  time: number; // seconds
};

export const LEVELS: LevelConfig[] = [
  {
    rows: 3,
    columns: 4,
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], // easy numbers
    time: 120, // 2 minutes
  },
  {
    rows: 4,
    columns: 5,
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], // medium numbers
    time: 120,
  },
  {
    rows: 5,
    columns: 5,
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9], // harder numbers
    time: 120,
  },
];
