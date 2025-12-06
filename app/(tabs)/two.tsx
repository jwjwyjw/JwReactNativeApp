import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/theme';
import { GlassCard } from '@/components/GlassCard';
import { useFocusEffect, useRouter } from 'expo-router';
import { NoteStorageService } from '@/services/noteStorage';
import { NoteCategory } from '@/types/note';
import { getCategoryLabel } from '@/utils/categoryLabel';
import { getCategoryAvatar, getAvatarBackgroundColor } from '@/utils/categoryAssets';

export default function SummaryPage() {
  const router = useRouter();
  const [noteCounts, setNoteCounts] = useState<{ [key in NoteCategory]: number }>({
    [NoteCategory.WORK_STUDY]: 0,
    [NoteCategory.LIFE]: 0,
    [NoteCategory.HEALTH]: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const loadNoteCounts = async () => {
    const counts = await NoteStorageService.getNoteCounts();
    setNoteCounts(counts);
  };

  useEffect(() => {
    loadNoteCounts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadNoteCounts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNoteCounts();
    setRefreshing(false);
  };

  const categories: NoteCategory[] = [
    NoteCategory.WORK_STUDY,
    NoteCategory.LIFE,
    NoteCategory.HEALTH,
  ];

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Summary</Text>
        <Image
          source={require('@/assets/images/robot.png')}
          style={styles.robotImage}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={COLORS.primaryText}
          />
        }
      >
        {categories.map((category) => {
          const count = noteCounts[category];
          const avatarSource = getCategoryAvatar(category);
          const label = getCategoryLabel(category);

          return (
            <View key={category} style={styles.categoryCard}>
              <View style={styles.categoryTopRow}>
                <View style={styles.categoryTopLeft}>
                  <View
                    style={[
                      styles.avatarContainer,
                      { backgroundColor: getAvatarBackgroundColor(category) },
                    ]}
                  >
                    {avatarSource ? (
                      <Image source={avatarSource} style={styles.avatarImage} />
                    ) : (
                      <Text style={styles.avatarEmoji}>👤</Text>
                    )}
                  </View>
                  <Text style={styles.categoryTitle}>{label}</Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push((`/category-notes?category=${category}` as any))
                  }
                >
                  <LinearGradient
                    colors={COLORS.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.detailButton}
                  >
                    <Text style={styles.detailButtonText}>Detail</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <GlassCard style={styles.statsBox}>
                <Text style={styles.statsText}>
                  This topic has a total of {count} records.
                </Text>
              </GlassCard>
            </View>
          );
        })}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    color: COLORS.primaryText,
  },
  robotImage: {
    width: 180,
    height: 180,
    resizeMode: 'contain',
    position: 'absolute',
    right: 0,
    top: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    backgroundColor: COLORS.borderSoftSubtle,
    borderRadius: 20,
  },
  categoryCard: {
    borderRadius: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  categoryTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  avatarEmoji: {
    fontSize: 24,
  },
  categoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  statsBox: {
    marginTop: 10,
  },
  statsText: {
    fontSize: 13,
    color: COLORS.mutedText,
  },
  detailButton: {
    backgroundColor: COLORS.accentPink,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  detailButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryText,
  },
});
