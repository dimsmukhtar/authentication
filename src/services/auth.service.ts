import { DocumentType } from "@typegoose/typegoose"
import { User } from "../models/User"
import { signJwt } from "../utils/jwt"
import SessionModel from "../models/Session"

export async function createSession(userId: string) {
  return SessionModel.create({ userId: userId })
}

export async function signRefreshToken(userId: string) {
  const session = await createSession(userId)
  const refreshToken = signJwt({ sessionId: session._id }, "refreshTokenPrivateKey")
  return refreshToken
}

export function signAccessToken(user: DocumentType<User>) {
  const payloadUser = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    verified: user.verified,
  }
  const accessToken = signJwt(payloadUser, "accessTokenPrivateKey")
  return accessToken
}
