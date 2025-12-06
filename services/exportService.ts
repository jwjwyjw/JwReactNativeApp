import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Note } from '@/types/note';
import { NoteStorageService } from '@/services/noteStorage';

/**
 * Helper to format all notes into a plain-text document.
 */
function buildExportText(notes: Note[]): string {
  if (!notes.length) {
    return 'No notes available.';
  }

  const lines: string[] = [];
  lines.push('Notes Export');
  lines.push(`Generated at: ${new Date().toISOString()}`);
  lines.push('');

  notes.forEach((note, index) => {
    const created = new Date(note.createdAt).toLocaleString();
    const updated = note.updatedAt
      ? new Date(note.updatedAt).toLocaleString()
      : null;

    lines.push(`Note ${index + 1}`);
    lines.push(`Category: ${note.category}`);
    lines.push(`Created: ${created}`);
    if (updated && updated !== created) {
      lines.push(`Last updated: ${updated}`);
    }
    lines.push('Content:');
    lines.push(note.content);
    lines.push('');
    lines.push('------------------------------');
    lines.push('');
  });

  return lines.join('\n');
}

export class ExportService {
  /**
   * Option A: Export notes as a text file in the app's document directory.
   * The file stays on disk even if notes inside the app are later deleted.
   */
  static async exportAsFile(): Promise<{ uri: string; fileName: string }> {
    const notes = await NoteStorageService.getAllNotesSorted();
    const content = buildExportText(notes);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `notes-export-${timestamp}.txt`;
    const fs: any = FileSystem as any;
    const baseDir: string = fs.documentDirectory || fs.cacheDirectory;
    const fileUri = baseDir + fileName;

    await FileSystem.writeAsStringAsync(fileUri, content, {
      encoding: (FileSystem as any).EncodingType?.UTF8 ?? 'utf8',
    } as any);

    return { uri: fileUri, fileName };
  }

  /**
   * Option B: Share using the platform share sheet (Mail, Files, etc.).
   * Users can choose to save the file somewhere safe, so it survives Delete All.
   */
  static async shareViaShareSheet(): Promise<void> {
    const notes = await NoteStorageService.getAllNotesSorted();
    const content = buildExportText(notes);

    const fs: any = FileSystem as any;
    const baseDir: string = fs.cacheDirectory || fs.documentDirectory;
    const tmpFile = baseDir + 'notes-export-share.txt';
    await FileSystem.writeAsStringAsync(tmpFile, content, {
      encoding: (FileSystem as any).EncodingType?.UTF8 ?? 'utf8',
    } as any);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(tmpFile, {
        mimeType: 'text/plain',
        dialogTitle: 'Export notes',
      });
    }
  }
}
