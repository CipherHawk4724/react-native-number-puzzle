// src/utils/animations/index.ts
import { Animated } from 'react-native';
import { AnimationConfig } from '../../types/game.types';

export const createScaleAnimation = (
  value: Animated.Value,
  toValue: number,
  config: AnimationConfig = {}
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue,
    duration: config.duration || 300,
    delay: config.delay || 0,
    useNativeDriver: config.useNativeDriver !== false,
  });
};

export const createFadeAnimation = (
  value: Animated.Value,
  toValue: number,
  config: AnimationConfig = {}
): Animated.CompositeAnimation => {
  return Animated.timing(value, {
    toValue,
    duration: config.duration || 300,
    delay: config.delay || 0,
    useNativeDriver: config.useNativeDriver !== false,
  });
};

export const createShakeAnimation = (
  value: Animated.Value,
  intensity: number = 10,
  config: AnimationConfig = {}
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: intensity,
      duration: config.duration || 50,
      useNativeDriver: config.useNativeDriver !== false,
    }),
    Animated.timing(value, {
      toValue: -intensity,
      duration: config.duration || 50,
      useNativeDriver: config.useNativeDriver !== false,
    }),
    Animated.timing(value, {
      toValue: intensity,
      duration: config.duration || 50,
      useNativeDriver: config.useNativeDriver !== false,
    }),
    Animated.timing(value, {
      toValue: 0,
      duration: config.duration || 50,
      useNativeDriver: config.useNativeDriver !== false,
    }),
  ]);
};

export const createPulseAnimation = (
  value: Animated.Value,
  config: AnimationConfig = {}
): Animated.CompositeAnimation => {
  return Animated.sequence([
    Animated.timing(value, {
      toValue: 1.3,
      duration: config.duration || 200,
      useNativeDriver: config.useNativeDriver !== false,
    }),
    Animated.timing(value, {
      toValue: 1,
      duration: config.duration || 200,
      useNativeDriver: config.useNativeDriver !== false,
    }),
  ]);
};

// Export animation presets
export const AnimationPresets = {
  select: {
    scale: 1.2,
    duration: 150,
  },
  match: {
    scale: 1.3,
    fade: 0.3,
    duration: 300,
  },
  shake: {
    intensity: 10,
    duration: 50,
  },
  pulse: {
    scale: 1.3,
    duration: 200,
  },
};