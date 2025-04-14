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

export const forgotPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Please input a valid email"),
  }),
})

export const resetPasswordSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Please input a valid email"),
    password: string({
      required_error: "Password is required",
    }).min(6, "Password minimum is 6 char"),
    passwordResetCode: string({
      required_error: "Password reset code is required",
    }),
    passwordConfirmation: string({
      required_error: "Password confirmation is required",
    }),
  }).refine((data) => data.password === data.passwordConfirmation, {
    message: "Password do not match",
    path: ["passwordConfirmation"],
  }),
})

export const updateMeSchema = object({
  body: object({
    firstName: string().optional(),
    lastName: string().optional(),
    email: string().email("Please input a valid email").optional(),
  }),
})

// interface/alias from zod
export type CreateUserInput = TypeOf<typeof createUserSchema>["body"]
export type VerifyUserInput = TypeOf<typeof verifyUserSchema>["body"]
export type ForgotPasswordInput = TypeOf<typeof forgotPasswordSchema>["body"]
export type ResetPasswordInput = TypeOf<typeof resetPasswordSchema>["body"]
export type UpdateMeInput = TypeOf<typeof updateMeSchema>["body"]
