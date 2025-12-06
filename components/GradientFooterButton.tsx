import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, RADII } from '@/theme';

interface GradientFooterButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger';
  containerStyle?: ViewStyle;
}

export const GradientFooterButton: React.FC<GradientFooterButtonProps> = ({
  label,
  onPress,
  disabled = false,
  containerStyle,
}) => {
  const buttonColors: readonly [string, string] = COLORS.buttonGradient;
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 20) : insets.bottom;

  return (
    <LinearGradient
      colors={COLORS.headerGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.footer, { paddingBottom: 30 + bottomPadding }, containerStyle]}
    >
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onPress}
        disabled={disabled}
      >
        <LinearGradient
          colors={buttonColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.buttonInner}
        >
          <Text style={styles.buttonText}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderTopLeftRadius: RADII.screen,
    borderTopRightRadius: RADII.screen,
  },
  button: {
    alignSelf: 'center',
    width: '80%',
    borderRadius: RADII.pill,
  },
  buttonInner: {
    paddingVertical: 20,
    borderRadius: RADII.pill,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
