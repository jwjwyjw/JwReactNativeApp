import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS, RADII } from '@/theme';

interface GlassCardProps {
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
}

export const GlassCard: React.FC<GlassCardProps> = ({ style, children }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADII.cardLg,
    padding: 16,
    borderWidth: 1,
    backgroundColor: COLORS.inputBackground,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
});
