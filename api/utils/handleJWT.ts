import jwt from "jsonwebtoken"
import type { StringValue } from "ms";

export const signAccessJWT = (id: number | string) => {
  const accessToken = jwt.sign(
    { sub: id },
    process.env.JWT_ACCESS_SECRET as any,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION as StringValue,
    }
  )
  return accessToken
}

export const signRefreshJWT = (id: string | number) => {
  const refreshToken = jwt.sign(
    { sub: id },
    process.env.JWT_REFRESH_SECRET as any,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION as StringValue,
    }
  )
  return refreshToken
}
