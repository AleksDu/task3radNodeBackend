

import express,{ NextFunction, Request, Response, Router } from "express";
import model from "../../../model/index";
import { HttpCode} from "../../../lib/constants";

import { validateCreate, validateUpdate, validateId } from "../validation";
import { Note, NoteStats } from '../../types';

const router:Router = express.Router();

router.get("/", async( req: Request, res: Response, next: NextFunction) =>
   {
    const notes: Note[] = await model.listNotes();
    res.status(200).json(notes);
  })


router.get("/stats", async (req: Request, res: Response, next: NextFunction) =>
{    const stats: NoteStats[] = await model.stats();
    res.status(200).json(stats);
  })


router.get("/:id", validateId, async (req: Request, res: Response, next: NextFunction) =>
 {
    const { id } = req.params;
    const note: Note | undefined = await model.getNoteById(id);
    if (!note) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "Note not found",
      });
    }
    res.status(200).json(note);
  })


router.post("/", validateCreate,async (req: Request, res: Response, next: NextFunction) => {
    const note: Note = await model.addNote(req.body);
    res.status(201).json(note);
  })


router.delete("/:id", validateId, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const note: Note[] | null = await model.deleteNote(id);
    if (!note) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "Note not found",
      });
    }
    res.status(200).json({ message: "Note deleted" });
  })


router.patch("/:id", validateId, validateUpdate, async (req: Request, res: Response, next: NextFunction) =>{
    const { id } = req.params;
    const note: Note | null = await model.updateNote(id, req.body);
    if (!note) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "Note not found",
      });
    }
    res.status(200).json(note);
  })
;

export default router;
