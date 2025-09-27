// src/components/common/Card/Card.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CardProps } from '../../../types/common.types';
import { styles } from './Card.styles';
import { Ionicons } from '@expo/vector-icons';

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  icon,
  variant = 'elevated',
  onPress,
  style,
  contentStyle,
  headerStyle,
  ...rest
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    if (variant === 'elevated') {
      return [...baseStyle, styles.elevated];
    } else if (variant === 'outlined') {
      return [...baseStyle, styles.outlined];
    } else if (variant === 'filled') {
      return [...baseStyle, styles.filled];
    }
    
    return baseStyle;
  };

  return (
    <CardComponent
      style={[getCardStyle(), style]}
      onPress={onPress}
      activeOpacity={0.7}
      {...rest}
    >
      {(title || subtitle || icon) && (
        <View style={[styles.header, headerStyle]}>
          <View style={styles.headerContent}>
            {icon && (
              <Ionicons name={icon} size={20} color="#666" style={styles.icon} />
            )}
            <View style={styles.titleContainer}>
              {title && <Text style={styles.title}>{title}</Text>}
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          </View>
          {onPress && (
            <Ionicons name="chevron-forward" size={16} color="#999" />
          )}
        </View>
      )}
      
      <View style={[styles.content, contentStyle]}>
        {children}
      </View>
    </CardComponent>
  );
};

export default Card;