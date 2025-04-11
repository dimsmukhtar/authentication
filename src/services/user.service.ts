import UserModel, { User } from "../models/User"

export function createUser(input: Partial<User>) {
  return UserModel.create(input)
}

export function findByEmail(email: string) {
  return UserModel.findOne({
    email,
    // verificationCode,
    // verificationCodeExpiresAt: { $gt: new Date() },
  })
}
