var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fs from 'fs/promises';
import { randomUUID } from 'crypto';
import notes from './notes.json';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const notesPath = path.join(__dirname, 'notes.json');
const listNotes = () => {
    return notes;
};
const getNoteById = (noteId) => {
    return notes.find((note) => note.id === noteId);
};
const stats = () => {
    const allCategories = notes.map((note) => note.category);
    const uniqueCategories = [...new Set(allCategories)];
    const stats = uniqueCategories.map((uniqueCategories) => {
        const obj = {
            [uniqueCategories]: {
                active: notes.filter((note) => note.category === uniqueCategories && note.isArchived === false).length,
                isArchived: notes.filter((note) => note.category === uniqueCategories && note.isArchived === true).length,
            },
        };
        return obj;
    });
    return stats;
};
const deleteNote = (noteId) => __awaiter(void 0, void 0, void 0, function* () {
    const notePersist = yield getNoteById(noteId);
    if (!notePersist) {
        return null;
    }
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    notes.splice(noteIndex, 1);
    yield fs.writeFile(notesPath, JSON.stringify(notes, null, 2));
    return notePersist;
});
const addNote = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const note = Object.assign(Object.assign({ id: randomUUID() }, body), { isArchived: false });
    notes.push(note);
    yield fs.writeFile(notesPath, JSON.stringify(notes, null, 2));
    return note;
});
const updateNote = (noteId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const notePersist = yield getNoteById(noteId);
    if (!notePersist) {
        return null;
    }
    const noteIndex = notes.findIndex((note) => note.id === noteId);
    notes[noteIndex] = Object.assign(Object.assign({}, notePersist), body);
    yield fs.writeFile(notesPath, JSON.stringify(notes, null, 2));
    return notes[noteIndex];
});
export default {
    listNotes,
    getNoteById,
    deleteNote,
    addNote,
    updateNote,
    stats,
};
