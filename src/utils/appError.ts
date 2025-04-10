class AppError extends Error {
  statusCode: number
  message: string
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export default AppError
