// src/types/common.types.ts
import { ReactNode } from 'react';
import { StyleProp, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';

// Button Types
export interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

// Modal Types
export interface ModalAction {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export interface CustomModalProps {
  visible?: boolean;
  onClose?: () => void;
  title: string;
  children: ReactNode;
  type?: 'info' | 'success' | 'warning' | 'error';
  showCloseButton?: boolean;
  animationType?: 'fade' | 'slide' | 'none';
  overlayClickClose?: boolean;
  actions?: ModalAction[];
}

// Card Types
export interface CardProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  icon?: string;
  variant?: 'elevated' | 'outlined' | 'filled';
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
}

// Loading Types
export interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  type?: 'spinner' | 'pulse' | 'dots';
  visible?: boolean;
}