import { Request, Response, NextFunction } from "express"
import mongoose from "mongoose"
import { CreateSessionInput } from "../schema/auth.schema"
import AppError from "../utils/appError"
import { findByEmail, findById } from "../services/user.service"
import {
  signAccessToken,
  signRefreshToken,
  findSessionById,
  deleteSession,
} from "../services/auth.service"
import { successResponse } from "../middlewares/successResponse"
import { setAccessToken, setRefreshToken } from "../utils/setCookies"
import { verifyJwtToken } from "../utils/jwt"

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
      return next(new AppError("Your're not verified", 400))
    }

    const isValid = await user.validatePassword(password)

    if (!isValid) {
      return next(new AppError("Invalid password", 400))
    }

    const accessToken = signAccessToken(user)
    const refreshToken = await signRefreshToken(user._id.toString(), undefined)
    setAccessToken(accessToken, res)
    setRefreshToken(refreshToken, res)

    successResponse(res, "Login success")
  } catch (error: any) {
    return next(new AppError(error.message, error.statusCode))
  }
}

export async function refreshTokenHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
      return next(new AppError("Could not find refresh token", 401))
    }

    const decoded = verifyJwtToken<{ sessionId: string }>(refreshToken, "refreshTokenPublicKey")

    if (!decoded) {
      return next(new AppError("Invalid refresh token", 401))
    }

    const session = await findSessionById(decoded.sessionId)
    if (!session) {
      return next(new AppError("Could not refresh access token", 401))
    }

    const user = await findById(String(session.userId))

    if (!user) {
      return next(new AppError("Could not find user for this refresh token", 401))
    }

    const newRefreshToken = await transactionForRefreshToken(
      session._id.toString(),
      user._id.toString()
    )
    if (newRefreshToken) {
      const accessToken = signAccessToken(user)
      setAccessToken(accessToken, res)
      setRefreshToken(newRefreshToken, res)
      successResponse(res, "Refresh token success")
    }
  } catch (error: any) {
    return next(new AppError(error.message, error.statusCode))
  }
}

async function transactionForRefreshToken(soldSessionId: string, userId: string) {
  const transactionSession = await mongoose.startSession()

  try {
    transactionSession.startTransaction()

    await deleteSession(soldSessionId, transactionSession)
    const newRefreshToken = await signRefreshToken(userId, transactionSession)

    await transactionSession.commitTransaction()

    return newRefreshToken
  } catch (error: any) {
    await transactionSession.abortTransaction()
    throw new AppError(`Refresh token rotation failed: ${error.message}`, 500)
  } finally {
    transactionSession.endSession()
  }
}
