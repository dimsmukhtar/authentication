import { NextFunction, Request, Response } from "express"
import { CreateUserInput } from "../schema/user.schema"
import { createUser } from "../services/user.service"
import { successResponse } from "../middlewares/successResponse"
import AppError from "../utils/appError"

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await createUser(req.body)
    successResponse(res, "Create user success", user, 201)
  } catch (error: any) {
    if (error.code === 11000) {
      // unique constraint error
      return next(new AppError("Account already exist", 409))
    }
    return next(new AppError(error.message, error.statusCode))
  }
}
