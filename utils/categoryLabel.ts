import { NoteCategory } from '@/types/note';

export const getCategoryLabel = (category: NoteCategory): string => {
  switch (category) {
    case NoteCategory.WORK_STUDY:
      return 'Work and study';
    case NoteCategory.LIFE:
      return 'Home life';
    case NoteCategory.HEALTH:
      return 'Health and wellness';
    default:
      return String(category);
  }
};
