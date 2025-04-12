import { Request, Response, NextFunction } from "express"
import AppError from "../utils/appError"
import { verifyJwtToken } from "../utils/jwt"
import { JwtPayload } from "../types/jwtPayload"

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessToken = req.cookies.accessToken

    if (!accessToken) {
      return next(new AppError("You are not logged in", 401))
    }

    const payload = verifyJwtToken(accessToken, "accessTokenPublicKey") as JwtPayload
    if (!payload) {
      return next(
        new AppError(
          "Something wrong with access token maybe it expired or accessTokenPublicKey is wrong",
          401
        )
      )
    }
    req.user = payload
    return next()
  } catch (error: any) {
    return next(new AppError(error.message, 500))
  }
}

export default authenticate
