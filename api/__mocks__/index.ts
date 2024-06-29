import { Request, Response, NextFunction } from "express-serve-static-core"

export const mockRequest = {
  signedCookies: jest.fn(() => mockResponse),
} as Request

export const mockResponse = {
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
  cookie: jest.fn(() => mockResponse),
  clearCookie: jest.fn(() => mockResponse),
  end: jest.fn(),
} as unknown as Response

export const mockNext = jest.fn()
