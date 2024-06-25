import { Request, Response, NextFunction } from "express-serve-static-core"

export const mockRequest = {} as Request

export const mockResponse = {
  status: jest.fn(),
  send: jest.fn(),
} as unknown as Response

export const mockNext = jest.fn()
