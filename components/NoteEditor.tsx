import React, { useState } from 'react';
import { Text, StyleSheet, TextInput, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import { NoteCategory } from '@/types/note';
import { GradientFooterButton } from '@/components/GradientFooterButton';
import { AppModal } from '@/components/AppModal';
import { CategoryDropdown } from '@/components/CategoryDropdown';
import { GlassCard } from '@/components/GlassCard';
import { COLORS } from '@/theme';

const MAX_CONTENT_LENGTH = 200;

interface NoteEditorProps {
  mode: 'create' | 'edit';
  initialCategory: NoteCategory | null;
  initialContent: string;
  onSaveNote: (category: NoteCategory, content: string) => Promise<void> | void;
  onDone: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  mode,
  initialCategory,
  initialContent,
  onSaveNote,
  onDone,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NoteCategory | null>(initialCategory);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const categories: NoteCategory[] = [
    NoteCategory.WORK_STUDY,
    NoteCategory.LIFE,
    NoteCategory.HEALTH,
  ];

  const remainingChars = MAX_CONTENT_LENGTH - content.length;

  const handleSave = async () => {
    if (!selectedCategory) {
      return;
    }
    if (!content.trim()) {
      return;
    }
    if (content.length > MAX_CONTENT_LENGTH) {
      return;
    }

    setIsSaving(true);
    try {
      await onSaveNote(selectedCategory, content.trim());
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const buttonLabel = isSaving
    ? 'Saving...'
    : mode === 'edit'
    ? 'Save changes'
    : 'Save';

  const successMessage = mode === 'edit' ? 'Note updated successfully.' : 'Note saved successfully.';

  return (
    <>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <CategoryDropdown
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <GlassCard style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Please input note content"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
            />
            {remainingChars < 0 && (
              <Text style={styles.charLimitWarning}>
                Note content cannot exceed {MAX_CONTENT_LENGTH} characters.
              </Text>
            )}
            <Text style={styles.charCounter}>
              {content.length}/{MAX_CONTENT_LENGTH}
            </Text>
          </GlassCard>
        </ScrollView>

        <GradientFooterButton
          label={buttonLabel}
          disabled={
            isSaving ||
            remainingChars < 0 ||
            content.length === 0 ||
            selectedCategory === null
          }
          onPress={handleSave}
        />

        <AppModal
          visible={showSuccessModal}
          title="Success"
          message={successMessage}
          onRequestClose={() => {
            setShowSuccessModal(false);
            onDone();
          }}
          buttons={[
            {
              label: 'OK',
              variant: 'primary',
              onPress: () => {
                setShowSuccessModal(false);
                onDone();
              },
            },
          ]}
        />
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  textInputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 250,
    marginBottom: 30,
  },
  textInput: {
    width: '100%',
    fontSize: 16,
    color: COLORS.primaryText,
    minHeight: 160,
  },
  charLimitWarning: {
    marginTop: 8,
    color: COLORS.accentPink,
    fontSize: 13,
  },
  charCounter: {
    marginTop: 4,
    alignSelf: 'flex-end',
    fontSize: 12,
    color: COLORS.mutedText,
  },
});
