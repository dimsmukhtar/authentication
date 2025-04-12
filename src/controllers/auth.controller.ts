import { Request, Response, NextFunction } from "express"
import { CreateSessionInput } from "../schema/auth.schema"
import AppError from "../utils/appError"
import { findByEmail } from "../services/user.service"
import { signAccessToken, signRefreshToken } from "../services/auth.service"
import { successResponse } from "../middlewares/successResponse"
import { setAccessToken, setRefreshToken } from "../utils/setCookies"

export async function createSessionHandler(
  req: Request<{}, {}, CreateSessionInput>,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body
  try {
    const user = await findByEmail(email)
    if (!user) {
      return next(new AppError("User with that email not found", 404))
    }
    if (!user.verified) {
      return next(new AppError("Your not verified", 400))
    }

    const isValid = await user.validatePassword(password)

    if (!isValid) {
      return next(new AppError("Invalid password", 400))
    }

    const accessToken = signAccessToken(user)
    const refreshToken = await signRefreshToken(user._id.toString())
    setAccessToken(accessToken, res)
    setRefreshToken(refreshToken, res)

    successResponse(res, "Login success")
  } catch (error: any) {
    return next(new AppError(error.message, error.statusCode))
  }
}
