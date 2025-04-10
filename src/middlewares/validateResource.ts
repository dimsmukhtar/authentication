import { Request, Response, NextFunction } from "express"
import { AnyZodObject, ZodError } from "zod"
import AppError from "../utils/appError"

export const validateResource =
  (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      next()
    } catch (error: any) {
      let errorMessage: string = error.message
      if (error instanceof ZodError) {
        const errorMessage = error.errors.map((err) => err.message).join(", ")
        return next(new AppError(errorMessage, 400))
      }
      return next(new AppError(errorMessage, 400))
    }
  }
