// app/components/Overlay/Overlay.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

type Props = {
  text: string;
  onPress: () => void;
};

export default function Overlay({ text, onPress }: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <Text style={styles.title}>{text}</Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: width * 0.7,
    padding: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
