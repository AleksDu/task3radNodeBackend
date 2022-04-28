

import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import {
  HttpCode
} from "../../../lib/constants";

const createSchema: ObjectSchema = Joi.object({
  text: Joi.string().min(2).max(30).required(),
  category: Joi.string().required(),
  time: Joi.string().required(),
});

const updateSchema: ObjectSchema = Joi.object({
  text: Joi.string().optional(),
  category: Joi.string().email().optional(),
  isArchived: Joi.boolean().optional(),
}).or("text", "category", "isArchived");



const IdSchema: ObjectSchema = Joi.object({
  id: Joi.string().required(),
});

export const validateCreate = async (req: Request, res: Response, next: NextFunction ) =>{
 {
    try {
      const value = await createSchema.validateAsync(req.body);
    } catch (err: any) {
         return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        message: err.message.replace(/"/g, ""),
      });
    }
    next()

  }
};



export const validateUpdate = async (req: Request, res: Response, next: NextFunction ) => {
    try {
      const value = await updateSchema.validateAsync(req.body);
    } catch (err: any) {
      const [{ type }] = err.details;
      if (type === "object.unknown") {
        return res.status(HttpCode.BAD_REQUEST).json({
          status: "error",
          message: "Invalid update fields",
        });
      }
      return res.status(HttpCode.BAD_REQUEST).json({
        status: "error",
        message: "missing required fields",
      });
    }
    next();
  };



export const validateId = async (req: Request, res: Response, next: NextFunction ) =>
 {
    try {
      const value = await IdSchema.validateAsync(req.params);
    } catch (err: any) {
      return res.status(HttpCode.NOT_FOUND).json({
        status: "error",
        message: "Note not found",
      });
    }
    next();
  }
