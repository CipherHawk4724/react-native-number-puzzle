// app/utils/helpers.ts

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generate a random number from a given array
 */
export function randomFromArray(array: number[]): number {
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

/**
 * Check if two numbers match according to game rule
 * Rule: equal OR sum = 10
 */
export function isMatch(num1: number, num2: number): boolean {
  return num1 === num2 || num1 + num2 === 10;
}
