// src/components/GameHeader/GameHeader.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { GameHeaderProps } from '../../types/game.types';
import { styles } from './GameHeader.styles';
import { Ionicons } from '@expo/vector-icons';

const GameHeader: React.FC<GameHeaderProps> = ({
  score = 0,
  level = 1,
  matches = 0,
  timeLeft = 0,
  onPause,
  onRestart,
  onLevelSelect,
  showTimer = false,
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (currentLevel: number): string => {
    const colors = ['#4CAF50', '#2196F3', '#FF9800'];
    return colors[currentLevel - 1] || colors[0];
  };

  const getLevelName = (currentLevel: number): string => {
    const names = ['Easy', 'Medium', 'Hard'];
    return names[currentLevel - 1] || names[0];
  };

  return (
    <View style={styles.container}>
      {/* Top Row - Main Stats */}
      <View style={styles.topRow}>
        {/* Score Section */}
        <View style={styles.statSection}>
          <Text style={styles.statLabel}>SCORE</Text>
          <Text style={styles.statValue}>{score}</Text>
        </View>

        {/* Level Section */}
        <TouchableOpacity 
          style={styles.statSection} 
          onPress={onLevelSelect}
          activeOpacity={0.7}
        >
          <Text style={styles.statLabel}>LEVEL</Text>
          <View style={[styles.levelBadge, { backgroundColor: getLevelColor(level) }]}>
            <Text style={styles.levelText}>
              {getLevelName(level)}
            </Text>
            <Text style={styles.levelNumber}>{level}</Text>
          </View>
        </TouchableOpacity>

        {/* Matches Section */}
        <View style={styles.statSection}>
          <Text style={styles.statLabel}>MATCHES</Text>
          <Text style={styles.statValue}>{matches}</Text>
        </View>
      </View>

      {/* Bottom Row - Controls and Timer */}
      <View style={styles.bottomRow}>
        {/* Timer (Conditional) */}
        {showTimer && (
          <View style={styles.timerSection}>
            <Ionicons name="time-outline" size={20} color="#666" />
            <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
          </View>
        )}

        {/* Spacer */}
        <View style={styles.spacer} />

        {/* Control Buttons */}
        <View style={styles.controlsSection}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={onPause}
            activeOpacity={0.7}
          >
            <Ionicons name="pause" size={24} color="#666" />
            <Text style={styles.controlText}>Pause</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.controlButton}
            onPress={onRestart}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={24} color="#666" />
            <Text style={styles.controlText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <View 
            style={[
              styles.progressFill,
              { 
                width: `${Math.min((matches / 20) * 100, 100)}%`,
                backgroundColor: getLevelColor(level)
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          Progress: {Math.min(matches, 20)}/20 matches
        </Text>
      </View>
    </View>
  );
};

export default GameHeader;