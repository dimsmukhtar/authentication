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

export function verifyJwtToken<T>(
  token: string,
  keyName: "accessTokenPublicKey" | "refreshTokenPublicKey"
): T | null {
  const publicKey = getKey(keyName)
  try {
    const decoded = jwt.verify(token, publicKey) as T
    return decoded
  } catch (error) {
    return null
  }
}
