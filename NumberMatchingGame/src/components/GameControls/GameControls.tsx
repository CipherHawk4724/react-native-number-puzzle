// src/components/GameControls/GameControls.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { GameControlsProps } from '../../types/game.types';
import { styles } from './GameControls.styles';
import { Ionicons } from '@expo/vector-icons';

const GameControls: React.FC<GameControlsProps> = ({
  onAddRow,
  onShuffle,
  onHint,
  onUndo,
  canAddRow = true,
  canUndo = false,
  hintCount = 3,
  addRowCost = 50,
  shuffleCost = 25,
  hintCost = 10,
  currentScore = 0,
}) => {
  const [hintsRemaining, setHintsRemaining] = useState(hintCount);
  const [lastAction, setLastAction] = useState<string>('');

  useEffect(() => {
    setHintsRemaining(hintCount);
  }, [hintCount]);

  const handleAddRow = () => {
    if (currentScore >= addRowCost || __DEV__) {
      onAddRow?.();
      setLastAction('row_added');
      // In a real game, you'd deduct points here
    } else {
      Alert.alert(
        'Not Enough Points',
        `You need ${addRowCost} points to add a new row.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleShuffle = () => {
    if (currentScore >= shuffleCost || __DEV__) {
      onShuffle?.();
      setLastAction('shuffled');
      Alert.alert('Board Shuffled', 'The numbers have been rearranged!');
    } else {
      Alert.alert(
        'Not Enough Points',
        `You need ${shuffleCost} points to shuffle the board.`,
        [{ text: 'OK' }]
      );
    }
  };

  const handleHint = () => {
    if (hintsRemaining > 0) {
      if (currentScore >= hintCost || __DEV__) {
        onHint?.();
        setHintsRemaining(prev => prev - 1);
        setLastAction('hint_used');
        Alert.alert('Hint Used', 'Look for matching pairs!');
      } else {
        Alert.alert(
          'Not Enough Points',
          `You need ${hintCost} points to use a hint.`,
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert('No Hints Left', 'You have used all your hints!');
    }
  };

  const handleUndo = () => {
    if (canUndo) {
      onUndo?.();
      setLastAction('undone');
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'row_added': return 'add-circle';
      case 'shuffled': return 'shuffle';
      case 'hint_used': return 'bulb';
      case 'undone': return 'arrow-undo';
      default: return 'time';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'row_added': return 'Row Added';
      case 'shuffled': return 'Board Shuffled';
      case 'hint_used': return 'Hint Used';
      case 'undone': return 'Move Undone';
      default: return 'Ready to Play';
    }
  };

  return (
    <View style={styles.container}>
      {/* Last Action Indicator */}
      {lastAction && (
        <View style={styles.lastAction}>
          <Ionicons 
            name={getActionIcon(lastAction)} 
            size={16} 
            color="#4CAF50" 
          />
          <Text style={styles.lastActionText}>
            {getActionText(lastAction)}
          </Text>
        </View>
      )}

      {/* Main Controls */}
      <View style={styles.controlsGrid}>
        {/* Add Row Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.primaryButton,
            !canAddRow && styles.disabledButton
          ]}
          onPress={handleAddRow}
          disabled={!canAddRow}
          activeOpacity={0.7}
        >
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Add Row</Text>
          <View style={styles.costBadge}>
            <Text style={styles.costText}>{addRowCost}</Text>
          </View>
        </TouchableOpacity>

        {/* Shuffle Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.secondaryButton
          ]}
          onPress={handleShuffle}
          activeOpacity={0.7}
        >
          <Ionicons name="shuffle" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Shuffle</Text>
          <View style={styles.costBadge}>
            <Text style={styles.costText}>{shuffleCost}</Text>
          </View>
        </TouchableOpacity>

        {/* Hint Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.accentButton,
            hintsRemaining === 0 && styles.disabledButton
          ]}
          onPress={handleHint}
          disabled={hintsRemaining === 0}
          activeOpacity={0.7}
        >
          <Ionicons name="bulb" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Hint</Text>
          <View style={styles.hintBadge}>
            <Text style={styles.hintText}>{hintsRemaining}</Text>
          </View>
          <View style={styles.costBadge}>
            <Text style={styles.costText}>{hintCost}</Text>
          </View>
        </TouchableOpacity>

        {/* Undo Button */}
        <TouchableOpacity
          style={[
            styles.controlButton,
            styles.neutralButton,
            !canUndo && styles.disabledButton
          ]}
          onPress={handleUndo}
          disabled={!canUndo}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-undo" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Undo</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Hints Left</Text>
          <Text style={styles.statValue}>{hintsRemaining}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Your Score</Text>
          <Text style={styles.statValue}>{currentScore}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Next Row</Text>
          <Text style={styles.statValue}>{addRowCost}</Text>
        </View>
      </View>
    </View>
  );
};

export default GameControls;