import { Response } from "express"

export const setAccessToken = (accessToken: string, res: Response) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 15 * 60 * 1000, // 15 minutes
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: "none",
  })
}

export const setRefreshToken = (refreshToken: string, res: Response) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: "none",
  })
}
