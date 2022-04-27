

import { NextFunction, Request, Response, Router } from "express";
import model from "../../../build/model/index";
import { HttpCode} from "./../../lib/constants";

import { validateCreate, validateUpdate, validateId } from "../validation";

const router = new Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) =>
   {
    const notes = await model.listNotes();
    res.status(200).json(notes);
  })


router.get("/stats", async (req: Request, res: Response, next: NextFunction) =>
{    const stats = await model.getStats();
    res.status(200).json(stats);
  })


router.get("/:id", validateId, async (req: Request, res: Response, next: NextFunction) =>
 {
    const { id } = req.params;
    const note = await model.getNote(id);
    if (!note) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "Note not found",
      });
    }
    res.status(200).json(note);
  })


router.post("/", validateCreate,async (req: Request, res: Response, next: NextFunction) => {
    const note = await model.addNote(req.body);
    res.status(201).json(note);
  })


router.delete("/:id", validateId, async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const note = await model.deleteNote(id);
    if (!note) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "Note not found",
      });
    }
    res.status(200).json({ message: "Note deleted" });
  })


router.patch("/:id", validateId, validateUpdate, async (req: Request, res: Response, next: NextFunction) =>{
    const { id } = req.params;
    const note = await model.updateNote(id, req.body);
    if (!note) {
      return res.status(HttpCode.NOT_FOUND).json({
        message: "Note not found",
      });
    }
    res.status(200).json(note);
  })
;

export default router;
