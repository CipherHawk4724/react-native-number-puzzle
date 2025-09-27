// src/utils/storage/gameStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameState {
  level: number;
  score: number;
  matches: number;
  timeLeft: number;
  hintsUsed: number;
  movesHistory: Array<{ cell1: any; cell2: any; score: number }>;
  timestamp: number;
}

const GAME_STATE_KEY = '@NumberMatch_gameState';

export const saveGameState = async (state: Partial<GameState>): Promise<void> => {
  try {
    const currentState = await loadGameState();
    const newState = {
      ...currentState,
      ...state,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(GAME_STATE_KEY, JSON.stringify(newState));
  } catch (error) {
    console.error('Error saving game state:', error);
  }
};

export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const savedState = await AsyncStorage.getItem(GAME_STATE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      // Check if state is not too old (e.g., 24 hours)
      const isRecent = Date.now() - state.timestamp < 24 * 60 * 60 * 1000;
      return isRecent ? state : null;
    }
    return null;
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

export const clearGameState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(GAME_STATE_KEY);
  } catch (error) {
    console.error('Error clearing game state:', error);
  }
};

export const hasSavedGame = async (): Promise<boolean> => {
  const state = await loadGameState();
  return state !== null;
};