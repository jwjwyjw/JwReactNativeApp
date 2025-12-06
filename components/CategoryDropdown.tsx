import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NoteCategory } from '@/types/note';
import { getCategoryLabel } from '@/utils/categoryLabel';
import { COLORS, RADII } from '@/theme';

interface CategoryDropdownProps {
  categories: NoteCategory[];
  selectedCategory: NoteCategory | null;
  onSelectCategory: (category: NoteCategory) => void;
}

export const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (category: NoteCategory) => {
    onSelectCategory(category);
    setIsOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.pickerContainer} onPress={handleToggle}>
        <Text style={styles.pickerText}>
          {selectedCategory ? getCategoryLabel(selectedCategory) : 'Choose a category'}
        </Text>
        <Ionicons
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={COLORS.primaryText}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdown}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={styles.categoryOption}
              onPress={() => handleSelect(category)}
            >
              <Text style={styles.categoryOptionText}>{getCategoryLabel(category)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
    position: 'relative',
    zIndex: 20,
  },
  pickerContainer: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: RADII.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: COLORS.borderSoftSubtle,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: COLORS.primaryText,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 12,
    backgroundColor: COLORS.overlayCard,
    borderRadius: RADII.cardLg,
    borderWidth: 1,
    borderColor: COLORS.borderSoft,
    // overflow: 'hidden',
    zIndex: 30,
    elevation: 10,
  },
  categoryOption: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderSoftSubtle,
  },
  categoryOptionText: {
    fontSize: 16,
    color: COLORS.primaryText,
  },
});
