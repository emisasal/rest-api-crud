import { Request, Response, NextFunction } from "express-serve-static-core"

export const mockRequest = {} as Request

export const mockResponse = {
  send: jest.fn(),
  status: jest.fn(() => mockResponse),
} as unknown as Response

export const mockNext = jest.fn()
