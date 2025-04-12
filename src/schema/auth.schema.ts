import { object, TypeOf, string } from "zod"

export const createSessionSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Invalid email"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password minimum is 6 char"),
  }),
})

export type CreateSessionInput = TypeOf<typeof createSessionSchema>["body"]
