// src/screens/GameScreen/GameScreen.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  BackHandler,
  AppState,
  AppStateStatus,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { GameScreenProps, RootStackParamList } from '../../types/navigation.types';
import { CellData } from '../../types/game.types';
import { styles } from './GameScreen.styles';

// Components
import GameBoard from '../../components/GameBoard';
import GameHeader from '../../components/GameHeader';
import GameControls from '../../components/GameControls';
import { CustomModal, LoadingSpinner, Button } from '../../components/common';

// Utilities
import { checkRemainingMoves } from '../../utils/gameLogic/gridGenerator';
import { GAME_CONFIGS } from '../../utils/constants/gameConfig';
import { saveGameState, loadGameState, clearGameState } from '../../utils/storage/gameStorage';

type GameScreenRouteProp = RouteProp<RootStackParamList, 'GameScreen'>;
type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GameScreen'>;

const GameScreen: React.FC<GameScreenProps> = () => {
  const route = useRoute<GameScreenRouteProp>();
  const navigation = useNavigation<GameScreenNavigationProp>();
  
  const { level = 1 } = route.params || {};

  // Game state
  const [score, setScore] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [boardCleared, setBoardCleared] = useState(false);
  const [canAddRow, setCanAddRow] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [movesHistory, setMovesHistory] = useState<Array<{ cell1: CellData; cell2: CellData; score: number }>>([]);

  // UI state
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAction, setLastAction] = useState<string>('');

  // Load saved game state on mount
  useEffect(() => {
    loadSavedGame();
    
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      backHandler.remove();
      appStateSubscription.remove();
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (gamePaused || gameOver || boardCleared) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleGameOver('time');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gamePaused, gameOver, boardCleared]);

  // Save game state when important values change
  useEffect(() => {
    if (!isLoading) {
      saveGameState({
        level,
        score,
        matches,
        timeLeft,
        hintsUsed,
        movesHistory,
      });
    }
  }, [score, matches, timeLeft, hintsUsed, movesHistory]);

  const loadSavedGame = async () => {
    try {
      setIsLoading(true);
      const savedState = await loadGameState();
      
      if (savedState && savedState.level === level) {
        setScore(savedState.score || 0);
        setMatches(savedState.matches || 0);
        setTimeLeft(savedState.timeLeft || 600);
        setHintsUsed(savedState.hintsUsed || 0);
        setMovesHistory(savedState.movesHistory || []);
        setLastAction('Game loaded successfully');
      }
    } catch (error) {
      console.error('Error loading game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background') {
      setGamePaused(true);
      setShowPauseModal(true);
    }
  };

  const handleBackPress = () => {
    if (!gameOver && !boardCleared) {
      setGamePaused(true);
      setShowPauseModal(true);
      return true;
    }
    return false;
  };

  const handleMatch = useCallback((cell1: CellData, cell2: CellData) => {
    const pointsEarned = 10 + (level * 5); // Bonus points based on level
    setScore(prev => prev + pointsEarned);
    setMatches(prev => prev + 1);
    
    // Add to moves history for undo functionality
    setMovesHistory(prev => [...prev, { cell1, cell2, score: pointsEarned }]);
    
    setLastAction(`Matched ${cell1.number} and ${cell2.number} (+${pointsEarned} points)`);
  }, [level]);

  const handleNoMovesLeft = useCallback(() => {
    setCanAddRow(true);
    setLastAction('No moves left - add a new row to continue');
    
    Alert.alert(
      'No More Moves',
      'Add a new row to continue playing or shuffle the board.',
      [
        { text: 'Add Row', onPress: handleAddRow },
        { text: 'Shuffle', onPress: handleShuffle },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, []);

  const handleBoardCleared = useCallback(() => {
    const bonusPoints = 100 * level;
    setScore(prev => prev + bonusPoints);
    setBoardCleared(true);
    setShowVictoryModal(true);
    setLastAction(`Board cleared! Bonus: +${bonusPoints} points`);
  }, [level]);

  const handleAddRow = useCallback(() => {
    if (score >= 50) {
      setScore(prev => prev - 50);
      setCanAddRow(false);
      setLastAction('New row added (-50 points)');
      // The actual row addition will be handled by GameBoard via props
    } else {
      Alert.alert('Not Enough Points', 'You need 50 points to add a new row.');
    }
  }, [score]);

  const handleShuffle = useCallback(() => {
    if (score >= 25) {
      setScore(prev => prev - 25);
      setLastAction('Board shuffled (-25 points)');
      // Shuffle logic will be handled by GameBoard
    } else {
      Alert.alert('Not Enough Points', 'You need 25 points to shuffle the board.');
    }
  }, [score]);

  const handleHint = useCallback(() => {
    if (hintsUsed < 3) {
      if (score >= 10) {
        setScore(prev => prev - 10);
        setHintsUsed(prev => prev + 1);
        setLastAction(`Hint used (${hintsUsed + 1}/3) -10 points`);
        // Hint logic will be handled by GameBoard
      } else {
        Alert.alert('Not Enough Points', 'You need 10 points to use a hint.');
      }
    } else {
      Alert.alert('No Hints Left', 'You have used all available hints.');
    }
  }, [score, hintsUsed]);

  const handleUndo = useCallback(() => {
    if (movesHistory.length > 0) {
      const lastMove = movesHistory[movesHistory.length - 1];
      setScore(prev => prev - lastMove.score);
      setMatches(prev => prev - 1);
      setMovesHistory(prev => prev.slice(0, -1));
      setLastAction('Last move undone');
      // Undo logic will be handled by GameBoard
    }
  }, [movesHistory]);

  const handlePause = useCallback(() => {
    setGamePaused(true);
    setShowPauseModal(true);
  }, []);

  const handleResume = useCallback(() => {
    setGamePaused(false);
    setShowPauseModal(false);
  }, []);

  const handleRestart = useCallback(() => {
    Alert.alert(
      'Restart Game',
      'Are you sure you want to restart? Your progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Restart',
          style: 'destructive',
          onPress: async () => {
            await clearGameState();
            setScore(0);
            setMatches(0);
            setTimeLeft(600);
            setGamePaused(false);
            setGameOver(false);
            setBoardCleared(false);
            setCanAddRow(false);
            setHintsUsed(0);
            setMovesHistory([]);
            setLastAction('Game restarted');
            setShowPauseModal(false);
          },
        },
      ]
    );
  }, []);

  const handleGameOver = useCallback((reason: 'time' | 'noMoves' | 'quit') => {
    setGameOver(true);
    setShowGameOverModal(true);
    
    let message = '';
    switch (reason) {
      case 'time':
        message = 'Time\'s up!';
        break;
      case 'noMoves':
        message = 'No more moves available!';
        break;
      case 'quit':
        message = 'Game ended.';
        break;
    }
    
    setLastAction(`Game Over: ${message}`);
  }, []);

  const handleQuit = useCallback(() => {
    Alert.alert(
      'Quit Game',
      'Are you sure you want to quit? Your progress will be saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Quit',
          style: 'destructive',
          onPress: () => {
            handleGameOver('quit');
            navigation.goBack();
          },
        },
      ]
    );
  }, [navigation]);

  const handleNextLevel = useCallback(() => {
    if (level < 3) {
      navigation.replace('GameScreen', { level: level + 1 });
    } else {
      Alert.alert('Congratulations!', 'You have completed all levels!');
      navigation.navigate('LevelSelect');
    }
  }, [level, navigation]);

  const getLevelConfig = () => GAME_CONFIGS[level];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner 
          size="large" 
          text="Loading Game..." 
          type="pulse" 
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Game Header */}
      <GameHeader
        score={score}
        level={level}
        matches={matches}
        timeLeft={timeLeft}
        onPause={handlePause}
        onRestart={handleRestart}
        showTimer={true}
      />

      {/* Last Action Indicator */}
      {lastAction && (
        <View style={styles.lastAction}>
          <Text style={styles.lastActionText}>{lastAction}</Text>
        </View>
      )}

      {/* Game Board */}
      <View style={styles.gameBoardContainer}>
        <GameBoard
          level={level}
          onMatch={handleMatch}
          onNoMovesLeft={handleNoMovesLeft}
          onBoardCleared={handleBoardCleared}
          onAddRow={handleAddRow}
        />
      </View>

      {/* Game Controls */}
      <GameControls
        onAddRow={handleAddRow}
        onShuffle={handleShuffle}
        onHint={handleHint}
        onUndo={handleUndo}
        canAddRow={canAddRow}
        canUndo={movesHistory.length > 0}
        hintCount={3 - hintsUsed}
        addRowCost={50}
        shuffleCost={25}
        hintCost={10}
        currentScore={score}
      />

      {/* Level Info */}
      <View style={styles.levelInfo}>
        <Text style={styles.levelInfoText}>
          Level {level}: {getLevelConfig().name}
        </Text>
        <Text style={styles.levelInfoSubtext}>
          Grid: {getLevelConfig().gridRows}×{getLevelConfig().gridCols} 
          • Target: {getLevelConfig().targetMatches} matches
        </Text>
      </View>

      {/* Pause Modal */}
      <CustomModal
        visible={showPauseModal}
        onClose={handleResume}
        title="Game Paused"
        type="info"
        actions={[
          {
            text: 'Resume',
            onPress: handleResume,
            variant: 'primary',
          },
          {
            text: 'Restart',
            onPress: handleRestart,
            variant: 'outline',
          },
          {
            text: 'Quit',
            onPress: handleQuit,
            variant: 'danger',
          },
        ]}
      >
        <Text style={styles.modalText}>
          Take a break! Your progress is automatically saved.
        </Text>
        <View style={styles.modalStats}>
          <Text>Score: {score}</Text>
          <Text>Matches: {matches}</Text>
          <Text>Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Text>
        </View>
      </CustomModal>

      {/* Game Over Modal */}
      <CustomModal
        visible={showGameOverModal}
        onClose={() => navigation.goBack()}
        title="Game Over"
        type="error"
        actions={[
          {
            text: 'Try Again',
            onPress: handleRestart,
            variant: 'primary',
          },
          {
            text: 'Level Select',
            onPress: () => navigation.navigate('LevelSelect'),
            variant: 'outline',
          },
          {
            text: 'Main Menu',
            onPress: () => navigation.navigate('Home'),
            variant: 'text',
          },
        ]}
      >
        <Text style={styles.modalText}>
          Final Score: {score}
        </Text>
        <Text style={styles.modalText}>
          Matches Made: {matches}
        </Text>
      </CustomModal>

      {/* Victory Modal */}
      <CustomModal
        visible={showVictoryModal}
        onClose={() => setShowVictoryModal(false)}
        title="Level Complete!"
        type="success"
        actions={[
          ...(level < 3 ? [{
            text: 'Next Level',
            onPress: handleNextLevel,
            variant: 'primary',
          }] : []),
          {
            text: 'Play Again',
            onPress: handleRestart,
            variant: 'outline',
          },
          {
            text: 'Level Select',
            onPress: () => navigation.navigate('LevelSelect'),
            variant: 'text',
          },
        ]}
      >
        <Text style={styles.modalText}>
          Congratulations! You cleared the board!
        </Text>
        <View style={styles.victoryStats}>
          <Text style={styles.victoryStat}>Final Score: {score}</Text>
          <Text style={styles.victoryStat}>Total Matches: {matches}</Text>
          <Text style={styles.victoryStat}>Time Bonus: +{Math.floor(timeLeft / 10)}</Text>
        </View>
      </CustomModal>
    </View>
  );
};

export default GameScreen;