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

export function findById(id: string) {
  return UserModel.findById(id)
}

export function updateMe(userId: string, data: Partial<User>) {
  return UserModel.findOneAndUpdate({ _id: userId }, data, { new: true })
}
