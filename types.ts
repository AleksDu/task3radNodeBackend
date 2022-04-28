import { Request, Response, NextFunction } from "express";

export interface Note {
    id: string;
    text: string;
    category: string;
    time: string;
    isArchived: boolean;
}

export interface NoteStats {
    [x: string]: {
        active: number;
        isArchived: number;
    };
}

