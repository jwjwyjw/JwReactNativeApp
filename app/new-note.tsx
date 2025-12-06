import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/theme';
import { useRouter } from 'expo-router';
import { NoteStorageService } from '@/services/noteStorage';
import { NoteCategory } from '@/types/note';
import { GradientHeader } from '@/components/GradientHeader';
import { NoteEditor } from '@/components/NoteEditor';

export default function NewNotePage() {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack?.()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const onSave = async (category: NoteCategory, noteContent: string) => {
    await NoteStorageService.saveNote({
      category,
      content: noteContent,
    });
  };

  return (
    <LinearGradient
      colors={COLORS.backgroundGradient}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <GradientHeader
        title="New note"
        showBackButton
        onBackPress={handleBack}
      />
      <NoteEditor
        mode="create"
        initialCategory={null}
        initialContent=""
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