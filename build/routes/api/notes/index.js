var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import model from "../../../model/index";
import { HttpCode } from "../../../lib/constants";
import { validateCreate, validateUpdate, validateId } from "./validation";
const router = express.Router();
router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const notes = yield model.listNotes();
    res.status(200).json(notes);
}));
router.get("/stats", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const stats = yield model.stats();
    res.status(200).json(stats);
}));
router.get("/:id", validateId, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const note = yield model.getNoteById(id);
    if (!note) {
        return res.status(HttpCode.NOT_FOUND).json({
            message: "Note not found",
        });
    }
    res.status(200).json(note);
}));
router.post("/", validateCreate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield model.addNote(req.body);
    res.status(201).json(note);
}));
router.delete("/:id", validateId, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const note = yield model.deleteNote(id);
    if (!note) {
        return res.status(HttpCode.NOT_FOUND).json({
            message: "Note not found",
        });
    }
    res.status(200).json({ message: "Note deleted" });
}));
router.patch("/:id", validateId, validateUpdate, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const note = yield model.updateNote(id, req.body);
    if (!note) {
        return res.status(HttpCode.NOT_FOUND).json({
            message: "Note not found",
        });
    }
    res.status(200).json(note);
}));
export default router;
