/**
 * Note categories available in the app
 */
export enum NoteCategory {
  WORK_STUDY = 'Work and Study',
  LIFE = 'Life',
  HEALTH = 'Health and wellness',
}

/**
 * Note interface representing a single note
 */
export interface Note {
  id: string;
  category: NoteCategory;
  content: string;
  createdAt: number; // timestamp when created
  updatedAt: number; // timestamp when last updated (created or edited)
}

/**
 * Grouped notes by category
 */
export interface GroupedNotes {
  [NoteCategory.WORK_STUDY]: Note[];
  [NoteCategory.LIFE]: Note[];
  [NoteCategory.HEALTH]: Note[];
}
