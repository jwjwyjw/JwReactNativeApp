import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/theme';
import { NoteListItem } from '@/components/NoteListItem';
import { ConfirmDeleteModal } from '@/components/ConfirmDeleteModal';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { NoteStorageService } from '@/services/noteStorage';
import { Note, NoteCategory } from '@/types/note';
import { getCategoryLabel } from '@/utils/categoryLabel';
import { GradientHeader } from '@/components/GradientHeader';

const MAX_PREVIEW_LENGTH = 20;

export default function CategoryNotesPage() {
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: NoteCategory }>();

  const [notes, setNotes] = useState<Note[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null);

  const loadNotes = async () => {
    if (!category) return;
    const data = await NoteStorageService.getNotesByCategory(category as NoteCategory);
    // Most recently updated first (with backward compatibility)
    setNotes(data.sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt;
      const bTime = b.updatedAt || b.createdAt;
      return bTime - aTime;
    }));
  };

  useEffect(() => {
    loadNotes();
  }, [category]);

  useFocusEffect(
    useCallback(() => {
      loadNotes();
    }, [category])
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

  if (!category) {
    return null;
  }

  const title = getCategoryLabel(category as NoteCategory);

  const getPreviewText = (content: string, maxLength: number = MAX_PREVIEW_LENGTH): string => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <GradientHeader
        title={title}
        showBackButton
        onBackPress={() => router.back()}
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
        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No notes in this category yet</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 20,
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
