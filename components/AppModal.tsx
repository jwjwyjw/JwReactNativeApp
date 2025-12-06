import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/theme';

export type AppModalButtonVariant = 'primary' | 'secondary' | 'destructive';

export interface AppModalButton {
  label: string;
  variant?: AppModalButtonVariant;
  onPress: () => void;
}

interface AppModalProps {
  visible: boolean;
  title: string;
  message?: string;
  buttons: AppModalButton[];
  onRequestClose?: () => void;
}

export function AppModal({ visible, title, message, buttons, onRequestClose }: AppModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose || (() => {})}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>{title}</Text>
          {!!message && <Text style={styles.message}>{message}</Text>}
          <View style={styles.buttonsRow}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={button.onPress}
              >
                {button.variant === 'secondary' ? (
                  <View style={styles.secondaryButton}>
                    <Text style={styles.secondaryText}>{button.label}</Text>
                  </View>
                ) : (
                  <LinearGradient
                    colors={COLORS.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.gradientButton}
                  >
                    <Text
                      style={
                        button.variant === 'destructive'
                          ? styles.destructiveText
                          : styles.primaryText
                      }
                    >
                      {button.label}
                    </Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLORS.modalBackground,
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 360,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primaryText,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: COLORS.modalMessageText,
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  gradientButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: COLORS.ghostButtonBackground,
  },
  primaryText: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '600',
  },
  secondaryText: {
    color: COLORS.primaryText,
    fontSize: 14,
  },
  destructiveText: {
    color: COLORS.primaryText,
    fontSize: 14,
    fontWeight: '600',
  },
});
