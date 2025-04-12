export interface JwtPayload {
  _id: string
  email: string
  firstName: string
  lastName: string
  role: string
  verified: boolean
  createdAt: string
  updatedAt: string
  iat: number
  exp: number
}
