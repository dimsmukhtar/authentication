import { DocumentType } from "@typegoose/typegoose"
import { omit } from "lodash"
import { User } from "../models/User"
import { signJwt } from "../utils/jwt"
import SessionModel from "../models/Session"

export async function createSession(userId: string) {
  return SessionModel.create({ userId: userId })
}

export async function signRefreshToken(userId: string) {
  const session = await createSession(userId)
  const refreshToken = signJwt({ sessionId: session._id }, "refreshTokenPrivateKey", {
    expiresIn: "1y",
  })
  return refreshToken
}

export function signAccessToken(user: DocumentType<User>) {
  const emitUser = [
    "password",
    "verificationCode",
    "verificationCodeExpiresAt",
    "passwordResetCode",
    "passwordResetCodeExpiresAt",
    "__v",
  ]
  const payloadUser = omit(user.toJSON(), emitUser)
  const accessToken = signJwt(payloadUser, "accessTokenPrivateKey", {
    expiresIn: "15m",
  })
  return accessToken
}

export function findSessionById(id: string) {
  return SessionModel.findById(id)
}
