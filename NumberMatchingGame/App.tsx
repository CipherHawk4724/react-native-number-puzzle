// App.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GameBoard from './src/components/GameBoard';
import GameHeader from './src/components/GameHeader';
import GameControls from './src/components/GameControls';
import { Button, CustomModal, Card, LoadingSpinner } from './src/components/common';
import { CellData } from './src/types/game.types';

export default function App() {
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState(0);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleMatch = (cell1: CellData, cell2: CellData) => {
    setMatches(prev => prev + 1);
    setScore(prev => prev + 10);
  };

  const handleAddRow = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Add row logic here
    }, 1000);
  };

  const welcomeModalActions = [
    {
      text: 'Start Game',
      onPress: () => setShowWelcomeModal(false),
      variant: 'primary' as const,
    },
    {
      text: 'Learn More',
      onPress: () => console.log('Learn more'),
      variant: 'outline' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {/* Welcome Modal */}
      <CustomModal
        visible={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        title="Welcome to Number Match!"
        type="info"
        actions={welcomeModalActions}
      >
        <Text style={styles.modalText}>
          Match numbers that are the same or add up to 10! Clear the board to win.
        </Text>
        <Card title="How to Play" variant="filled" style={styles.infoCard}>
          <Text>• Tap two connected numbers</Text>
          <Text>• They must be same or sum to 10</Text>
          <Text>• Clear the board to earn points!</Text>
        </Card>
      </CustomModal>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingSpinner 
            size="large" 
            text="Adding new row..." 
            type="pulse" 
          />
        </View>
      )}

      <GameHeader
        score={score}
        level={level}
        matches={matches}
        onRestart={() => {
          setScore(0);
          setMatches(0);
        }}
      />

      <View style={styles.gameBoardContainer}>
        <GameBoard
          level={level}
          onMatch={handleMatch}
          onAddRow={handleAddRow}
        />
      </View>

      <GameControls
        onAddRow={handleAddRow}
        currentScore={score}
      />

      {/* Additional Buttons Example */}
      <View style={styles.exampleSection}>
        <Card title="Quick Actions" variant="elevated">
          <Button
            title="Add 100 Points"
            variant="secondary"
            icon="add"
            onPress={() => setScore(prev => prev + 100)}
            style={styles.exampleButton}
          />
          <Button
            title="Reset Game"
            variant="outline"
            icon="refresh"
            onPress={() => {
              setScore(0);
              setMatches(0);
            }}
            style={styles.exampleButton}
          />
          <Button
            title="Show Welcome"
            variant="text"
            icon="information"
            onPress={() => setShowWelcomeModal(true)}
            style={styles.exampleButton}
          />
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  gameBoardContainer: {
    flex: 1,
    minHeight: 300,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#333',
  },
  infoCard: {
    marginTop: 16,
  },
  exampleSection: {
    padding: 16,
  },
  exampleButton: {
    marginBottom: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});