import { Response } from "express"

interface MetaData {
  [key: string]: any
}

interface SuccessResponse<T> {
  success: boolean
  message: string
  data?: T
  [key: string]: any
}

export function successResponse<T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
  meta: MetaData = {}
): Response<SuccessResponse<T>> {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...meta,
  })
}
