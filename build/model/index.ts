import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { fileURLToPath } from "url";
import notes from '../model/notes.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const notesPath = path.join(__dirname, "notes.json");

const listNotes = () => {
  return notes;
};

const getNoteById = (noteId: string) => {
  return notes.find((note) => note.id === noteId);
};

const stats = () => {
  const allCategories = notes.map((note) => note.category);  
  const uniqueCategories = [...new Set(allCategories)];
  const stats = uniqueCategories.map((uniqueCategories) => {
    const obj = {
      [uniqueCategories]: {
        active: notes.filter(
          (note) =>
            note.category === uniqueCategories && note.isArchived === false
        ).length,
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
    const notePersist = await getNoteById(noteId);
    if (!notePersist) {
      return null;
    }
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    notes.splice(noteIndex, 1);
    await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));
    return notePersist;
  }

const addNote = async (body: any) =>
  {
    const note = Object.assign(Object.assign({ id: randomUUID }, body), {
      isArchived: false,
    });
    notes.push(note);
    await fs.writeFile(notesPath, JSON.stringify(notes, null, 2));
    return note;
  }

const updateNote = async (noteId: string, body: any) =>
  {
    const notePersist = await getNoteById(noteId);
    if (!notePersist) {
      return null;
    }
    const noteIndex = notes.findIndex((note) => note.id === noteId);
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
