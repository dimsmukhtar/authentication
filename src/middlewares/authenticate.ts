import { Request, Response, NextFunction } from "express"
import AppError from "../utils/appError"
import { verifyJwtToken } from "../utils/jwt"
import { UserPayload } from "../types/UserPayload"

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
      return next(new AppError("You are not logged in", 401))
    }

    const payload = verifyJwtToken(accessToken, "accessTokenPublicKey")
    if (payload) {
      req.user = <UserPayload>payload
    }
    return next()
  } catch (error: any) {
    return next(new AppError(error.message, 500))
  }
}

export default authenticate
