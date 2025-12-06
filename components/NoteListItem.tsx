import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADII } from '@/theme';
import { GlassCard } from '@/components/GlassCard';

interface NoteListItemProps {
  previewText: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteListItem({ previewText, onEdit, onDelete }: NoteListItemProps) {
  return (
    <GlassCard style={styles.noteItem}>
      <View style={styles.noteMain}>
        <TouchableOpacity style={styles.textWrapper} onPress={onEdit}>
          <Text style={styles.noteText} numberOfLines={2}>
            {previewText}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="create-outline" style={styles.editIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
            <Ionicons name="trash-outline" style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  noteItem: {
    marginBottom: 10,
  },
  noteMain: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textWrapper: {
    flex: 1,
    marginRight: 12,
    justifyContent: 'center',
  },
  noteText: {
    fontSize: 14,
    color: COLORS.primaryText,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editIcon: {
    fontSize: 22,
    color: COLORS.accentPink,
    marginLeft: 10,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 6,
    borderRadius: RADII.circle,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteIcon: {
    fontSize: 20,
    color: COLORS.primaryText,
  },
});
