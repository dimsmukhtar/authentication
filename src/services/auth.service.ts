import { DocumentType } from "@typegoose/typegoose"
import mongoose from "mongoose"
import { omit } from "lodash"
import { User } from "../models/User"
import { signJwt } from "../utils/jwt"
import SessionModel from "../models/Session"

export async function deleteSession(id: string, session?: mongoose.ClientSession) {
  return SessionModel.deleteOne({ _id: id }).session(session || null)
}
export async function createSession(userId: string, session?: mongoose.ClientSession) {
  const newSession = new SessionModel({ userId })
  return newSession.save({ session })
}

export async function signRefreshToken(userId: string, session?: mongoose.ClientSession) {
  const newSession = await createSession(userId, session)
  const refreshToken = signJwt({ sessionId: newSession._id }, "refreshTokenPrivateKey", {
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
