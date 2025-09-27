// src/components/common/Loading/LoadingSpinner.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { LoadingSpinnerProps } from '../../../types/common.types';
import { styles } from './LoadingSpinner.styles';
import { Ionicons } from '@expo/vector-icons';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = '#4CAF50',
  text,
  type = 'spinner',
  visible = true,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;
  const pulseValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (visible) {
      if (type === 'spinner') {
        Animated.loop(
          Animated.timing(spinValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        ).start();
      } else if (type === 'pulse') {
        Animated.loop(
          Animated.sequence([
            Animated.timing(pulseValue, {
              toValue: 1.2,
              duration: 600,
              useNativeDriver: true,
            }),
            Animated.timing(pulseValue, {
              toValue: 1,
              duration: 600,
              useNativeDriver: true,
            }),
          ])
        ).start();
      }
    } else {
      spinValue.stopAnimation();
      pulseValue.stopAnimation();
    }
  }, [visible, type]);

  if (!visible) return null;

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'large': return 48;
      default: return 32;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return 12;
      case 'large': return 16;
      default: return 14;
    }
  };

  const renderSpinner = () => {
    if (type === 'spinner') {
      return (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons 
            name="refresh" 
            size={getSize()} 
            color={color} 
          />
        </Animated.View>
      );
    } else if (type === 'pulse') {
      return (
        <Animated.View style={{ transform: [{ scale: pulseValue }] }}>
          <Ionicons 
            name="ellipse" 
            size={getSize()} 
            color={color} 
          />
        </Animated.View>
      );
    } else if (type === 'dots') {
      return (
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: color,
                  width: getSize() / 3,
                  height: getSize() / 3,
                  transform: [{
                    scale: pulseValue.interpolate({
                      inputRange: [1, 1.2],
                      outputRange: [1, 1.5 - (index * 0.2)],
                    }),
                  }],
                },
              ]}
            />
          ))}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      {renderSpinner()}
      {text && (
        <Text style={[styles.text, { fontSize: getTextSize(), color }]}>
          {text}
        </Text>
      )}
    </View>
  );
};

export default LoadingSpinner;