import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII } from '@/theme';

interface GradientHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightContent?: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightContent,
  containerStyle,
  titleStyle,
}) => {
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'android' ? Math.max(insets.top, 20) : insets.top;

  return (
    <LinearGradient
      colors={COLORS.headerGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.header, { paddingTop: 30 + topPadding }, containerStyle]}
    >
      <View style={styles.leftSection}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={28} color={COLORS.primaryText} />
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, titleStyle]}>{title}</Text>
      </View>
      {rightContent && <View style={styles.rightSection}>{rightContent}</View>}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: RADII.screen,
    borderBottomRightRadius: RADII.screen,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 28,
    color: COLORS.primaryText,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
