import { Response } from "express"

export const setAccessToken = (accessToken: string, res: Response) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: "none",
  })
}

export const setRefreshToken = (refreshToken: string, res: Response) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "PRODUCTION",
    sameSite: "none",
  })
}
