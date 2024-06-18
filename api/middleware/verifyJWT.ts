import { Request, Response, NextFunction } from "express"
import jwt, { Secret } from "jsonwebtoken"

export interface Session extends Request {
  session: { user: string | null }
}

const verifyJWT = (req: Session, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req.signedCookies
  const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env
  //   req.session.user = null
  console.log("access_token", access_token)
  console.log("refresh_token", refresh_token)

  //   const data = jwt.verify(refresh_token, JWT_REFRESH_SECRET as Secret)
  //   console.log("data", data)

  next()
}

export default verifyJWT

// Recieve access and refresh tokens
// If no refresh token return unauthorized
// If refresh token invalid return unauthorized
// if valid refresh and no access, create and return new access token
