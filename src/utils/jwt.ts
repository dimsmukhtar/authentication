import jwt from "jsonwebtoken"

const getKey = (key: string) => {
  return process.env[key]?.replace(/\\n/g, "\n") as string
}

export function signJwt(
  object: Object,
  keyName: "accessTokenPrivateKey" | "refreshTokenPrivateKey",
  options?: jwt.SignOptions | undefined
) {
  const privateKey = getKey(keyName)
  return jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  })
}

export function verifyJwt() {}
