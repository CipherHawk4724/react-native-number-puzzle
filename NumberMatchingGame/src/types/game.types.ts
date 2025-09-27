// src/types/game.types.ts
export interface CellData {
  id: string;
  number: number;
  row: number;
  col: number;
  isMatched: boolean;
}

export interface GameBoardProps {
  level?: number;
  onMatch?: (cell1: CellData, cell2: CellData) => void;
  onNoMovesLeft?: () => void;
  onBoardCleared?: () => void;
  onAddRow?: () => void;
}

export interface NumberCellProps {
  cell: CellData;
  size: number;
  isSelected?: boolean;
  onPress: (cell: CellData) => void;
}

export interface GameHeaderProps {
  score?: number;
  level?: number;
  matches?: number;
  timeLeft?: number;
  onPause?: () => void;
  onRestart?: () => void;
  onLevelSelect?: () => void;
  showTimer?: boolean;
}

export interface GameControlsProps {
  onAddRow?: () => void;
  onShuffle?: () => void;
  onHint?: () => void;
  onUndo?: () => void;
  canAddRow?: boolean;
  canUndo?: boolean;
  hintCount?: number;
  addRowCost?: number;
  shuffleCost?: number;
  hintCost?: number;
  currentScore?: number;
}

export interface GameConfig {
  gridRows: number;
  gridCols: number;
  numbersRange: [number, number];
  maxConnections: number;
}

export type Direction = 'horizontal' | 'vertical' | 'diagonal';

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  useNativeDriver?: boolean;
}