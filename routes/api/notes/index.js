import { Router } from "express";
import model from "../../../model/index";

import { validateCreate, validateUpdate, validateId } from "./validation";

const router = new Router();

router.get("/", async (req, res, next) => {
  const notes = await model.listNotes();
  res.status(200).json(notes);
});

router.get("/stats", async (req, res, next) => {
  const stats = await model.getStats();
  res.status(200).json(stats);
});

router.get("/:id", validateId, async (req, res, next) => {
  const { id } = req.params;
  const note = await model.getNoteById(id);
  note
    ? res.status(200).json(note)
    : res.status(404).json({ message: "Note not found" });
});

router.post("/", validateCreate, async (req, res, next) => {
  const note = await model.addNote(req.body);
  res.status(201).json(note);
});

router.delete("/:id", validateId, async (req, res, next) => {
  const { id } = req.params;
  const note = await model.deleteNote(id);
  note
    ? res.status(200).json(note)
    : res.status(404).json({ message: "Note not found" });
});

router.patch("/:id", validateId, validateUpdate, async (req, res, next) => {
  const { id } = req.params;
  const note = await model.updateNote(id, req.body);
  note
    ? res.status(200).json(note)
    : res.status(404).json({ message: "Note not found" });
});

export default router;
