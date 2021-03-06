import fs from 'fs/promises'
import { randomUUID } from 'crypto'
import notes from './notes.json'
import { fileURLToPath } from 'url'
import path from 'path'

import { Note, NoteStats } from '../types'

const __dirname: string = path.dirname(fileURLToPath(import.meta.url))
const notesPath: string = path.join(__dirname, 'notes.json')

interface AddBodyType {
  text: string,
  category: string,
  time: string
}

interface UpdateBodyType {
  text?: string,
  category?: string,
  time?: string
}

const listNotes = () => {
  return notes
}

const getNoteById = (noteId: string) => {
  const note: Note | undefined = notes.find(note => note.id == noteId)
  return note;
};

const stats = () => {
  const allCategories: string[] = notes.map((note) => note.category);  
  const uniqueCategories: string[] = [...new Set(allCategories)];
  const stats: NoteStats[] = uniqueCategories.map((uniqueCategories) => {
    const obj: NoteStats = {
      [uniqueCategories]: {
        active: notes.filter(
          note =>
            note.category === uniqueCategories && note.isArchived === false).length,
        isArchived: notes.filter(
          (note) =>
            note.category === uniqueCategories && note.isArchived === true
        ).length,
      },
    };
    return obj;
  });
  return stats;
};

const deleteNote = async (noteId: string) =>
  {
    const notePersist: Note | undefined = await getNoteById(noteId);
    if (!notePersist) {
      return null;
    }
  const notesDeleted: Note[] = notes.findIndex((note) => note.id !== noteId);
  await fs.writeFile(notesPath, JSON.stringify(notesDeleted, null, 2));
  return notesDeleted;
  
  }

const addNote = async (body: AddBodyType) =>  {
    const newNote: Note = { id: randomUUID(), ...body, 
      isArchived: false,
    };
    notes.push(newNote);
    await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));
    return newNote;
  }


const updateNote = async (noteId: string, body: UpdateBodyType) =>
  {
    const notePersist = await getNoteById(noteId);
    if (!notePersist) {
      return null;
    }
    const noteIndex: number = notes.findIndex((note) => note.id === noteId);
    notes[noteIndex] = {
      ...notePersist,
      ...body,
    };
    await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));
    return notes[noteIndex];
  }

export default {
  listNotes,
  getNoteById,
  deleteNote,
  addNote,
  updateNote,
  stats,
};