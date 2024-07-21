import type { Request, Response, NextFunction } from "express"
import { prisma } from "../config/prismaClient"
import bcrypt from "bcrypt"
import jwt, { type Secret } from "jsonwebtoken"
import { signAccessJWT, signRefreshJWT } from "../utils/handleJWT"
import errorHandler from "../utils/errorHandler"
import capitalizeWords from "../utils/capitalizeWords"
import redis from "../config/redisClient"

// @desc Create new Customer
// @route POST /api/customer/register
// @body {first_name: string, last_name: string, email: string, password: string}
export const postRegisterCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = req.body
    data.first_name = capitalizeWords(data.first_name)
    data.last_name = capitalizeWords(data.last_name)

    const findCustomer = await prisma.customer.findFirst({
      where: { email: data.email },
    })
    if (findCustomer) {
      return next(errorHandler(400, "Customer already registered"))
    }

    const saltRounds = Number(process.env.SALT_ROUNDS)
    const hashPassword = await bcrypt.hash(data.password, saltRounds)
    data.password = hashPassword

    const newCustomer = await prisma.customer.create({
      data: data,
    })
    if (!newCustomer) {
      return next(errorHandler(409, "Error creating Customer"))
    }

    const cacheKeys = await redis.keys("getAllCustomers:*")
    cacheKeys ?? (await redis.del(cacheKeys))

    const { password, created_at, updated_at, ...newCustomerNoPass } =
      newCustomer

    return res.status(201).send({
      success: true,
      statusCode: 201,
      data: newCustomerNoPass,
    })
  } catch (error) {
    return next(error)
  }
}

// @desc Login Customer
// @route POST /api/customer/login
// @body {email: string, password: string}
export const postLoginCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const email = req.body.email
    const pass = req.body.password

    const loginCustomer = await prisma.customer.findFirst({
      where: { email: email },
    })
    if (!loginCustomer) {
      return next(errorHandler(401, "Invalid credentials"))
    }

    const redisSession = await redis.get(`session:${loginCustomer.customer_id}`)
    if (redisSession) {
      const refreshSession = JSON.parse(redisSession)
      const { refresh_token } = req.signedCookies

      if (refresh_token === refreshSession) {
        return res.status(200).send({
          success: true,
          statusCode: 200,
          message: "User already logged",
        })
      }
    }

    const isValidCustomer = await bcrypt.compare(pass, loginCustomer?.password)
    if (!isValidCustomer) {
      return next(errorHandler(401, "Invalid credentials"))
    }

    const { password, created_at, updated_at, ...customer } = loginCustomer

    const accessToken = signAccessJWT(customer.customer_id)

    res.cookie("access_token", accessToken, {
      httpOnly: true, // only access through server
      secure: process.env.NODE_ENV === "production", // https only
      sameSite: "strict", // same domain access
      maxAge: 60 * 1000 * 15, // 15min
      signed: true, // encrypt cookie (not the content)
    })

    const refreshToken = signRefreshJWT(customer.customer_id)

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      signed: true,
    })

    redis.set(
      `session:${customer.customer_id}`,
      JSON.stringify(refreshToken),
      "EX",
      2629743
    )

    return res.status(200).send({
      success: true,
      statusCode: 200,
      data: customer,
    })
  } catch (error) {
    next(error)
  }
}

// @desc Logout Customer
// @route POST /api/customer/logout
export const postLogoutCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { refresh_token, access_token } = req.signedCookies
    const { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } = process.env

    // Logged Customer can't delete itself
    // Add logic...

    const refreshToken = refresh_token
      ? jwt.verify(refresh_token, JWT_REFRESH_SECRET as Secret)
      : null

    const accessToken = access_token
      ? jwt.verify(access_token, JWT_ACCESS_SECRET as Secret)
      : null

    if (refreshToken || accessToken) {
      await redis.del(`session:${refreshToken?.sub || accessToken?.sub}`)
    }

    return res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .status(200)
      .send({
        success: true,
        statusCode: 200,
        message: refreshToken ? "Customer logout" : "No Customer to logout",
      })
      .end()
  } catch (error) {
    return next(error)
  }
}
