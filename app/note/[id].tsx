import React, { useEffect, useState } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { NoteStorageService } from '@/services/noteStorage';
import { Note, NoteCategory } from '@/types/note';
import { GradientHeader } from '@/components/GradientHeader';
import { NoteEditor } from '@/components/NoteEditor';

export const options = {
  headerShown: false,
};

export default function EditNotePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);

  const handleBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const onSave = async (category: NoteCategory, noteContent: string) => {
    if (!id) return;
    await NoteStorageService.updateNote(id, {
      category,
      content: noteContent,
    });
  }

  useEffect(() => {
    const loadNote = async () => {
      if (!id) return;
      const allNotes = await NoteStorageService.getAllNotes();
      const found = allNotes.find((n) => n.id === id);
      if (found) {
        setNote(found);
      } else {
        router.replace('/(tabs)');
      }
    };

    loadNote();
  }, [id, router]);

  if (!note) {
    return null;
  }

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <GradientHeader
        title="Edit note"
        showBackButton
        onBackPress={handleBack}
      />
      <NoteEditor
        mode="edit"
        initialCategory={note.category as NoteCategory}
        initialContent={note.content}
        onSaveNote={onSave}
        onDone={handleBack}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});