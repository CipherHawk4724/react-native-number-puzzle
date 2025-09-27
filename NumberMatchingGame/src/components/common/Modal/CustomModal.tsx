// src/components/common/Modal/CustomModal.tsx
import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableWithoutFeedback, Animated } from 'react-native';
import { CustomModalProps } from '../../../types/common.types';
import { styles } from './CustomModal.styles';
import Button from '../Button/Button';
import { Ionicons } from '@expo/vector-icons';

const CustomModal: React.FC<CustomModalProps> = ({
  visible = false,
  onClose,
  title,
  children,
  type = 'info',
  showCloseButton = true,
  animationType = 'fade',
  overlayClickClose = true,
  actions,
}) => {
  const scaleValue = new Animated.Value(0);
  const fadeValue = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'checkmark-circle', color: '#4CAF50' };
      case 'warning':
        return { name: 'warning', color: '#FF9800' };
      case 'error':
        return { name: 'close-circle', color: '#F44336' };
      case 'info':
      default:
        return { name: 'information-circle', color: '#2196F3' };
    }
  };

  const handleOverlayPress = () => {
    if (overlayClickClose) {
      onClose?.();
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <Animated.View style={[styles.overlay, { opacity: fadeValue }]}>
          <TouchableWithoutFeedback>
            <Animated.View 
              style={[
                styles.modalContainer,
                { 
                  transform: [{ scale: scaleValue }],
                  opacity: fadeValue 
                }
              ]}
            >
              {/* Header */}
              <View style={[styles.header, styles[`${type}Header`]]}>
                <View style={styles.titleContainer}>
                  <Ionicons 
                    name={iconConfig.name} 
                    size={24} 
                    color={iconConfig.color} 
                  />
                  <Text style={styles.title}>{title}</Text>
                </View>
                
                {showCloseButton && (
                  <Button
                    variant="text"
                    icon="close"
                    onPress={onClose}
                    style={styles.closeButton}
                    textStyle={styles.closeButtonText}
                  />
                )}
              </View>

              {/* Content */}
              <View style={styles.content}>
                {children}
              </View>

              {/* Actions */}
              {actions && actions.length > 0 && (
                <View style={styles.actions}>
                  {actions.map((action, index) => (
                    <Button
                      key={index}
                      title={action.text}
                      variant={action.variant || 'primary'}
                      onPress={action.onPress}
                      style={[styles.actionButton, action.style]}
                      disabled={action.disabled}
                    />
                  ))}
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CustomModal;