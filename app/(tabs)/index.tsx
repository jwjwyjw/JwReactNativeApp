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
import { NoteListItem } from '@/components/NoteListItem';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { useRouter, useFocusEffect } from 'expo-router';
import { NoteStorageService } from '@/services/noteStorage';
import { Note, NoteCategory } from '@/types/note';
import { getCategoryIcon } from '@/utils/categoryAssets';
import { getCategoryLabel } from '@/utils/categoryLabel';
import { GradientHeader } from '@/components/GradientHeader';

export default function HomePage() {
  const router = useRouter();
  const [groupedNotes, setGroupedNotes] = useState<{ [key in NoteCategory]: Note[] }>({
    [NoteCategory.WORK_STUDY]: [],
    [NoteCategory.LIFE]: [],
    [NoteCategory.HEALTH]: [],
  });
  const [refreshing, setRefreshing] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const loadNotes = async () => {
    const notes = await NoteStorageService.getLatestNotesByCategory(3);
    setGroupedNotes(notes);
  };

  useEffect(() => {
    loadNotes();
  }, []);

  // Reload notes when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const onDeleteNote = async () => {
    if (!deleteNoteId) return;
    await NoteStorageService.deleteNote(deleteNoteId);
    await loadNotes();
    setDeleteNoteId(null);
  };

  const getPreviewText = (content: string, maxLength: number = 20): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const renderCategory = (category: NoteCategory, notes: Note[]) => {
    const iconSource = getCategoryIcon(category);
    const categoryTitle = getCategoryLabel(category);

    return (
      <View key={category} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryTitleRow}>
            <Image source={iconSource} style={styles.categoryIconImage} />
            <Text style={styles.categoryTitle}>{categoryTitle}</Text>
          </View>
        </View>

        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notes yet</Text>
          </View>
        ) : (
          notes.map((note) => (
            <NoteListItem
              key={note.id}
              previewText={getPreviewText(note.content)}
              onEdit={() => router.push((`/note/${note.id}` as any))}
              onDelete={() => setDeleteNoteId(note.id)}
            />
          ))
        )}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <GradientHeader
        title="Home"
        containerStyle={{ paddingTop: 60, paddingBottom: 14 }}
        rightContent={
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/settings' as any)}
          >
            <Image
              source={require('@/assets/images/icons/settings.png')}
              style={styles.settingsIcon}
            />
          </TouchableOpacity>
        }
      />

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
        <View style={styles.recentSection}>
          <View style={styles.recentHeader}>
            <Image
              source={require('@/assets/images/icons/clock.png')}
              style={styles.recentIcon}
            />
            <Text style={styles.recentTitle}>Recently created notes</Text>
          </View>
        </View>

        {renderCategory(NoteCategory.WORK_STUDY, groupedNotes[NoteCategory.WORK_STUDY])}
        {renderCategory(NoteCategory.LIFE, groupedNotes[NoteCategory.LIFE])}
        {renderCategory(NoteCategory.HEALTH, groupedNotes[NoteCategory.HEALTH])}
      </ScrollView>

      <ConfirmDeleteModal
        visible={deleteNoteId !== null}
        onCancel={() => setDeleteNoteId(null)}
        onConfirm={onDeleteNote}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  settingsButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
  },
  recentIcon: {
    width: 19,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  recentTitle: {
    fontSize: 16,
    color: COLORS.mutedText,
    fontWeight: '400',
    fontFamily: 'PingFang SC',
  },
  categorySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryHeader: {
    marginBottom: 12,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIconImage: {
    width: 19,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primaryText,
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.mutedText,
    fontStyle: 'italic',
  },
});
