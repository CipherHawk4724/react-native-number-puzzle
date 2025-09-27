// src/components/NumberCell/NumberCell.tsx
import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Animated, Text } from 'react-native';
import { NumberCellProps } from '../../types/game.types';
import { styles } from './NumberCell.styles';

const NumberCell: React.FC<NumberCellProps> = ({
  cell,
  size,
  isSelected = false,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;

  // Animation for selection
  useEffect(() => {
    if (isSelected) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [isSelected, scaleAnim]);

  // Animation for matched cells
  useEffect(() => {
    if (cell.isMatched) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
  }, [cell.isMatched, scaleAnim, fadeAnim]);

  const handlePress = () => {
    if (!cell.isMatched) {
      onPress(cell);
    }
  };

  const handleInvalidMatch = () => {
    // Shake animation for invalid matches
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Trigger invalid match animation when cell is selected but not matched
  useEffect(() => {
    if (isSelected && !cell.isMatched) {
      const timer = setTimeout(() => {
        handleInvalidMatch();
      }, 1000); // Shake after 1 second if still selected
        
      return () => clearTimeout(timer);
    }
  }, [isSelected, cell.isMatched]);

  const getCellStyle = () => {
    const baseStyle = [
      styles.cell,
      {
        width: size,
        height: size,
        borderRadius: size * 0.2,
      },
    ];

    if (cell.isMatched) {
      return [...baseStyle, styles.matchedCell];
    }

    if (isSelected) {
      return [...baseStyle, styles.selectedCell];
    }

    return [...baseStyle, styles.defaultCell];
  };

  const getTextStyle = () => {
    if (cell.isMatched) {
      return styles.matchedText;
    }

    if (isSelected) {
      return styles.selectedText;
    }

    return styles.defaultText;
  };

  const getBackgroundColor = () => {
    if (cell.isMatched) {
      return '#E0E0E0'; // Light gray for matched cells
    }

    if (isSelected) {
      return '#4CAF50'; // Green for selected cells
    }

    // Different colors based on number for better visual distinction
    const numberColors: { [key: number]: string } = {
      1: '#FFCDD2', // Light red
      2: '#F8BBD0', // Light pink
      3: '#E1BEE7', // Light purple
      4: '#D1C4E9', // Light deep purple
      5: '#C5CAE9', // Light indigo
      6: '#BBDEFB', // Light blue
      7: '#B3E5FC', // Light light blue
      8: '#B2EBF2', // Light cyan
      9: '#B2DFDB', // Light teal
    };

    return numberColors[cell.number] || '#F5F5F5'; // Default light gray
  };

  const animatedStyle = {
    transform: [
      { scale: scaleAnim },
      { translateX: shakeAnim },
    ],
    opacity: fadeAnim,
    backgroundColor: getBackgroundColor(),
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={cell.isMatched}
    >
      <Animated.View style={[getCellStyle(), animatedStyle]}>
        <Text style={getTextStyle()}>
          {cell.number}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default NumberCell;