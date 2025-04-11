import { object, string, TypeOf } from "zod"

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "First name is required",
    }),
    lastName: string({
      required_error: "Last name is required",
    }),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password minimum is 6 char"),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
    email: string({
      required_error: "Email is required",
    }).email("Please input a valid email"),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ["passwordConfirmation"],
  }),
})

export const verifyUserSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Please input a valid email"),
    verificationCode: string({
      required_error: "Verification code is required",
    }),
  }),
})

// interface/alias from zod
export type CreateUserInput = TypeOf<typeof createUserSchema>["body"]
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["body"]
