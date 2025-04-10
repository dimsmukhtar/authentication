import UserModel, { User } from "../models/User"

export function createUser(input: Partial<User>) {
  return UserModel.create(input)
}
