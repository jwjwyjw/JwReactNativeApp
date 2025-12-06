import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, NoteCategory } from '@/types/note';

const NOTES_STORAGE_KEY = '@notes_app_data';

/**
 * Service for managing note storage using AsyncStorage
 */
export class NoteStorageService {
  /**
   * Get all notes from storage
   */
  static async getAllNotes(): Promise<Note[]> {
    try {
      const data = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return [];
    } catch (error) {
      console.error('Error loading notes:', error);
      return [];
    }
  }

  /**
   * Update an existing note by ID
   */
  static async updateNote(
    id: string,
    updates: Partial<Omit<Note, 'id' | 'createdAt'>>
  ): Promise<Note | null> {
    try {
      const notes = await this.getAllNotes();
      const index = notes.findIndex((note) => note.id === id);
      if (index === -1) {
        return null;
      }

      const updatedNote: Note = {
        ...notes[index],
        ...updates,
        updatedAt: Date.now(), // Update the timestamp when edited
      };

      notes[index] = updatedNote;
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      return updatedNote;
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  }

  /**
   * Save a new note
   */
  static async saveNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> {
    try {
      const notes = await this.getAllNotes();
      const timestamp = Date.now();
      const newNote: Note = {
        ...note,
        id: timestamp.toString(),
        createdAt: timestamp,
        updatedAt: timestamp, // Set both timestamps when created
      };
      notes.push(newNote);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      return newNote;
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  }

  /**
   * Delete a specific note by ID
   */
  static async deleteNote(id: string): Promise<void> {
    try {
      const notes = await this.getAllNotes();
      const filteredNotes = notes.filter(note => note.id !== id);
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  }

  /**
   * Delete all notes
   */
  static async deleteAllNotes(): Promise<void> {
    try {
      await AsyncStorage.removeItem(NOTES_STORAGE_KEY);
    } catch (error) {
      console.error('Error deleting all notes:', error);
      throw error;
    }
  }

  /**
   * Get all notes sorted by updatedAt (most recent first)
   */
  static async getAllNotesSorted(): Promise<Note[]> {
    try {
      const notes = await this.getAllNotes();
      return notes.sort((a, b) => {
        // Handle backward compatibility - if updatedAt doesn't exist, use createdAt
        const aTime = a.updatedAt || a.createdAt;
        const bTime = b.updatedAt || b.createdAt;
        return bTime - aTime;
      });
    } catch (error) {
      console.error('Error getting sorted notes:', error);
      return [];
    }
  }

  /**
   * Get notes by category
   */
  static async getNotesByCategory(category: NoteCategory): Promise<Note[]> {
    try {
      const notes = await this.getAllNotes();
      return notes.filter(note => note.category === category);
    } catch (error) {
      console.error('Error getting notes by category:', error);
      return [];
    }
  }

  /**
   * Get latest N notes for each category
   */
  static async getLatestNotesByCategory(limit: number = 3): Promise<{ [key in NoteCategory]: Note[] }> {
    try {
      const notes = await this.getAllNotes();
      
      const grouped: { [key in NoteCategory]: Note[] } = {
        [NoteCategory.WORK_STUDY]: [],
        [NoteCategory.LIFE]: [],
        [NoteCategory.HEALTH]: [],
      };

      // Group notes by category
      notes.forEach(note => {
        if (grouped[note.category]) {
          grouped[note.category].push(note);
        }
      });

      // Sort by updatedAt (descending) and take latest N
      Object.keys(grouped).forEach(category => {
        grouped[category as NoteCategory] = grouped[category as NoteCategory]
          .sort((a, b) => {
            // Handle backward compatibility - if updatedAt doesn't exist, use createdAt
            const aTime = a.updatedAt || a.createdAt;
            const bTime = b.updatedAt || b.createdAt;
            return bTime - aTime;
          })
          .slice(0, limit);
      });

      return grouped;
    } catch (error) {
      console.error('Error getting latest notes:', error);
      return {
        [NoteCategory.WORK_STUDY]: [],
        [NoteCategory.LIFE]: [],
        [NoteCategory.HEALTH]: [],
      };
    }
  }

  /**
   * Get count of notes per category
   */
  static async getNoteCounts(): Promise<{ [key in NoteCategory]: number }> {
    try {
      const notes = await this.getAllNotes();
      
      const counts: { [key in NoteCategory]: number } = {
        [NoteCategory.WORK_STUDY]: 0,
        [NoteCategory.LIFE]: 0,
        [NoteCategory.HEALTH]: 0,
      };

      notes.forEach(note => {
        if (counts[note.category] !== undefined) {
          counts[note.category]++;
        }
      });

      return counts;
    } catch (error) {
      console.error('Error getting note counts:', error);
      return {
        [NoteCategory.WORK_STUDY]: 0,
        [NoteCategory.LIFE]: 0,
        [NoteCategory.HEALTH]: 0,
      };
    }
  }
}
