import { NextFunction, Request, Response } from "express"
import {
  CreateUserInput,
  VerifyUserInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "../schema/user.schema"
import { createUser, findByEmail } from "../services/user.service"
import { successResponse } from "../middlewares/successResponse"
import AppError from "../utils/appError"
import sendEmail from "../utils/mailer"
import { toJakartaTime } from "../utils/time"
import { nanoid } from "nanoid"
import { UserPayload } from "../types/UserPayload"

export async function createUserHandler(
  req: Request<{}, {}, CreateUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await createUser({
      ...req.body,
      verificationCodeExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    })
    await sendEmail({
      email: user.email,
      subject: "Verify your account",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Email Verification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #5f6FFF, #5f6FFF); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Verification Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Hello,</p>
    <p>Thank you for creating an account with us.</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #5f6FFF;">${user.verificationCode}</span>
    </div>
    <p>Please use the code above to verify your account, it will expire in 15 minutes.</p>
    <p>If you did not create an account with us, please ignore this email.</p>
    <p>Best regards,<br>The Team</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>
      If you did not create an account with us, please ignore this email.</p>
  </div>
</body>
</html>,`,
    })
    const userResponse = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      verified: user.verified,
      verificationCodeExpiresAt: toJakartaTime(user.verificationCodeExpiresAt),
    }
    successResponse<typeof userResponse>(
      res,
      "Create user success, verification code has been sent to your email",
      userResponse,
      201
    )
  } catch (error: any) {
    if (error.code === 11000) {
      // unique constraint error
      return next(new AppError("Account already exist", 409))
    }
    return next(new AppError(error.message, error.statusCode))
  }
}

export async function verifyUserHandler(
  req: Request<{}, {}, VerifyUserInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await findByEmail(req.body.email)
    if (!user) {
      return next(new AppError("User with that email not found", 400))
    }
    if (user.verified) {
      return next(new AppError("User already verified", 400))
    }
    if (user?.verificationCodeExpiresAt && user.verificationCodeExpiresAt < new Date()) {
      return next(new AppError("Verification code expired", 400))
    }
    if (user.verificationCode !== req.body.verificationCode) {
      return next(new AppError("Invalid verification code", 400))
    }
    user.verified = true
    user.verificationCode = null
    user.verificationCodeExpiresAt = null
    await user.save()
    successResponse(res, "Verify user success")
  } catch (error: any) {
    return next(new AppError(error.message, error.statusCode))
  }
}

export async function forgotPasswordHandler(
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await findByEmail(req.body.email)
    if (!user) {
      return next(new AppError("User with that email not found", 404))
    }
    if (!user.verified) {
      return next(new AppError("User not verified", 400))
    }

    if (user.passwordResetCodeExpiresAt && user.passwordResetCodeExpiresAt > new Date()) {
      return next(new AppError("Password reset code already sent", 400))
    }

    const passwordResetCode = nanoid()
    user.passwordResetCode = passwordResetCode
    user.passwordResetCodeExpiresAt = new Date(Date.now() + 15 * 60 * 1000)
    await user.save()

    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      html: `
    <html>
    <head>
      <title>Password Reset</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(to right, #5f6FFF, #5f6FFF); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Password Reset</h1>
      </div>
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
        <p>Hello,</p>
        <p>We received a request to reset your password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <p>Your password reset code is: ${passwordResetCode}</p>
          <p>Please use the code above to reset your password, it will expire in 15 minutes..</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
          <p>If you did not create an account with us, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
    `,
    })

    const response = {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      verified: user.verified,
      passwordResetCodeExpiresAt: toJakartaTime(user.passwordResetCodeExpiresAt),
    }

    successResponse<typeof response>(
      res,
      "Password reset code has been sent to your email",
      response
    )
  } catch (error: any) {
    return next(new AppError(error.message, error.statusCode))
  }
}

export async function resetPasswordHandler(
  req: Request<{}, {}, ResetPasswordInput>,
  res: Response,
  next: NextFunction
) {
  const { email, password, passwordResetCode } = req.body
  try {
    const user = await findByEmail(email)
    if (!user) {
      return next(new AppError("User with that email not found", 404))
    }
    if (user.passwordResetCodeExpiresAt && user.passwordResetCodeExpiresAt < new Date()) {
      return next(new AppError("Password reset code expired", 400))
    }
    if (user.passwordResetCode !== passwordResetCode) {
      return next(new AppError("Invalid password reset code", 400))
    }
    user.password = password
    user.passwordResetCode = null
    user.passwordResetCodeExpiresAt = null
    await user.save()

    successResponse(res, "Reset password success")
  } catch (error: any) {
    return next(new AppError(error.message, error.statusCode))
  }
}

export async function meHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as UserPayload
    successResponse<UserPayload>(res, "Success", user)
  } catch (error: any) {
    return next(new AppError(error.message, error.statusCode))
  }
}
