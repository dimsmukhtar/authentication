import {
  DocumentType,
  getModelForClass,
  index,
  modelOptions,
  pre,
  prop,
  Severity,
} from "@typegoose/typegoose"
import { nanoid } from "nanoid"
import argon2 from "argon2"
import logger from "../utils/logger"

type UserRole = "user" | "admin"

@pre<User>("save", async function () {
  if (!this.isModified("password")) {
    return
  }
  const hash = await argon2.hash(this.password)
  this.password = hash
  return
})
@modelOptions({
  schemaOptions: {
    timestamps: true, // added updatedAt and createdAt to model
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({ lowercase: true, required: true, unique: true })
  email: string

  @prop({ required: true })
  firstName: string

  @prop({ required: true })
  lastName: string

  @prop({ required: true })
  password: string

  @prop({ type: String, enum: ["user", "admin"], default: "user" })
  role: UserRole

  @prop({ default: () => nanoid() })
  verificationCode: string | null

  @prop()
  verificationCodeExpiresAt: Date | null

  @prop()
  passwordResetCode: string | null

  @prop()
  passwordResetCodeExpiresAt: Date | null

  @prop({ default: false })
  verified: boolean

  async validatePassword(this: DocumentType<User>, rawPassword: string) {
    try {
      return await argon2.verify(this.password, rawPassword)
    } catch (error) {
      if (error instanceof Error) {
        logger.error(error.message)
      } else {
        logger.error("Unknown error occurred during validate password")
        console.log("Raw error: ", error)
      }
    }
  }
}

const UserModel = getModelForClass(User)

export default UserModel
