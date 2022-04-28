var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Joi from "joi";
import { HttpCode } from "../../../lib/constants";
const createSchema = Joi.object({
    text: Joi.string().min(2).max(30).required(),
    category: Joi.string().required(),
    time: Joi.string().required(),
});
const updateSchema = Joi.object({
    text: Joi.string().optional(),
    category: Joi.string().email().optional(),
    isArchived: Joi.boolean().optional(),
}).or("text", "category", "isArchived");
// const regLimit = /\d+/;
// const querySchema = Joi.object({
//   limit: Joi.string().pattern(regLimit).optional(),
//   skip: Joi.number().min(0).optional(),
//   sortBy: Joi.string().valid("name", "email").optional(),
//   sortByDesc: Joi.string().valid("name", "email").optional(),
//   filter: Joi.string()
//     // eslint-disable-next-line prefer-regex-literals
//     .pattern(new RegExp("(name|email)\\|?(name|email)+"))
//     .optional(),
// });
const IdSchema = Joi.object({
    id: Joi.string().required(),
});
export const validateCreate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    {
        try {
            const value = yield createSchema.validateAsync(req.body);
        }
        catch (err) {
            return res.status(HttpCode.BAD_REQUEST).json({
                status: "error",
                message: err.message.replace(/"/g, ""),
            });
        }
        next();
    }
});
export const validateUpdate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = yield updateSchema.validateAsync(req.body);
    }
    catch (err) {
        const [{ type }] = err.details;
        if (type === "object.allowUnknown") {
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
});
// export const validateUpdateFavorite = async (req, res, next) => {
//   try {
//     await updateFavoriteSchema.validateAsync(req.body);
//   } catch (err) {
//     const [{ type }] = err.details;
//     if (type === "object.missing") {
//       return res.status(400).json({ message: "missing field favorite" });
//     }
//     return res.status(400).json({ message: err.message });
//   }
//   next();
// };
export const validateId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = yield IdSchema.validateAsync(req.params);
    }
    catch (err) {
        return res.status(HttpCode.NOT_FOUND).json({
            status: "error",
            message: "Note not found",
        });
    }
    next();
});
// export const validateQuery = async (req, res, next) => {
//   try {
//     await querySchema.validateAsync(req.query);
//   } catch (err) {
//     return res
//       .status(400)
//       .json({ message: `Field ${err.message.replace(/"/g, "")}` });
//   }
//   next();
// };
