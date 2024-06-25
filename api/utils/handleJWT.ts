import jwt, { Secret } from "jsonwebtoken"

export const signAccessJWT = (id: number | string) => {
  const accessToken = jwt.sign(
    { sub: id },
    process.env.JWT_ACCESS_SECRET as Secret,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRATION,
    }
  )
  return accessToken
}

export const signRefreshJWT = (id: string | number) => {
  const refreshToken = jwt.sign(
    { sub: id },
    process.env.JWT_REFRESH_SECRET as Secret,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    }
  )
  return refreshToken
}
