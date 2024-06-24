import { Request, Response, NextFunction } from "express"
import jwt, { Secret } from "jsonwebtoken"
import { signAccessJWT } from "utils/handleJWT"

// export interface Session extends Request {
//   session: { user: string | null }
// }

const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const { access_token, refresh_token } = req.signedCookies
  const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env
  //   req.session.user = null

  const refreshToken = refresh_token
    ? jwt.verify(refresh_token, JWT_REFRESH_SECRET as Secret)
    : null

  if (!refreshToken) {
    return res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .status(401)
      .send({
        success: false,
        statusCode: 401,
        message: "Unauthorized",
      })
      .end()
  }

  const accessToken = access_token
    ? jwt.verify(access_token, JWT_ACCESS_SECRET as Secret)
    : null

  if (!accessToken) {
    const newAccessToken = signAccessJWT(Number(refreshToken?.sub))
    res.cookie("access_token", newAccessToken, {
      httpOnly: true, // only access through server
      secure: process.env.NODE_ENV === "production", // https only
      sameSite: "strict", // same domain access
      maxAge: 60 * 1000 * 15, // 15min
      signed: true, // encrypt cookie (not the content)
    })
  }

  next()
}

export default verifyJWT

// Recieve access_token and refresh_token jwt in cookies
// If invalid or no refresh_token, return 401 and clear cookies
// if invalid or no access_token with valid refresh_token, create and return new access_token and send cookie
