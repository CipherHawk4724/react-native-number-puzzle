// src/components/NumberCell/NumberCell.styles.ts
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 2,
  },
  defaultCell: {
    borderColor: '#BDBDBD',
  },
  selectedCell: {
    borderColor: '#388E3C',
    shadowColor: '#4CAF50',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  matchedCell: {
    borderColor: '#9E9E9E',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  defaultText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  selectedText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  matchedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#757575',
    textDecorationLine: 'line-through',
  },
  // Animation styles
  shakeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  invalid: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  invalidText: {
    color: '#D32F2F',
  },
});