import { mockRequest, mockResponse, mockNext } from "../../__mocks__"
import {
  postLoginCustomer,
  postLogoutCustomer,
  postRegisterCustomer,
} from "../customerSession.controller"
import { prisma } from "../../config/prismaClient"
import CustomError from "../../classes/CustomError"
import { clearRedisCache } from "../../__mocks__/clearRedisCache"
import { createCustomer, registeredCustomer } from "../../__mocks__/customerMocks"

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => []),
  })),
}))

describe("customerSession controller", () => {
  beforeAll(async () => {
    mockRequest.body = registeredCustomer
    await postRegisterCustomer(mockRequest, mockResponse, mockNext)
  })
  beforeEach(async () => {
    await clearRedisCache()
  })

  afterEach(async () => {
    await postLogoutCustomer(mockRequest, mockResponse, mockNext)

    const newCustomerExists = await prisma.customer.findFirst({
      where: {
        email: "bob@dylan.com",
      },
    })
    if (newCustomerExists) {
      await prisma.customer.delete({
        where: {
          email: "bob@dylan.com",
        },
      })
    }
  })

  afterAll(async () => {
    await prisma.customer.delete({
      where: {
        email: "tom@petty.com",
      },
    })
  })

  describe("postRegisterCustomer", () => {
    test("Returns error 422 if data not validated", async () => {
      mockRequest.body = {}
      await postRegisterCustomer(mockRequest, mockResponse, mockNext)

      const errorValidation = new Error() as CustomError
      errorValidation.message =
        "Cannot read properties of undefined (reading 'replace')"
      errorValidation.status = 422

      expect(mockNext).toHaveBeenCalledWith(errorValidation)
    })

    test("Returns error 400 if customer exist", async () => {
      mockRequest.body = registeredCustomer
      await postRegisterCustomer(mockRequest, mockResponse, mockNext)

      const errorAlreadyCreated = new Error() as CustomError
      errorAlreadyCreated.message = "Customer already registered"
      errorAlreadyCreated.status = 400

      expect(mockNext).toHaveBeenCalledWith(errorAlreadyCreated)
    })

    test("Registers new customer", async () => {
      mockRequest.body = createCustomer
      await postRegisterCustomer(mockRequest, mockResponse, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.send).toHaveBeenCalled()
    })
  })

  describe("postLoginCustomer", () => {
    test("Returns 422 error if data not validated", async () => {
      mockRequest.body = { email: "notValidEmail", password: "09876543" }
      await postLoginCustomer(mockRequest, mockResponse, mockNext)

      const errorValidation = new Error() as CustomError
      errorValidation.message = "Invalid credentials"
      errorValidation.status = 422

      expect(mockNext).toHaveBeenCalledWith(errorValidation)
    })

    test("Returns error 401 if Invalid Credentials", async () => {
      mockRequest.body = { email: "tom@petty.com", password: "09876543" }
      const isLoged = await postLoginCustomer(
        mockRequest,
        mockResponse,
        mockNext
      )

      const errorValidation = new Error() as CustomError
      errorValidation.message = "Invalid credentials"

      expect(isLoged).toBeFalsy()
      expect(mockNext).toHaveBeenCalledWith(errorValidation)
    })

    test("Login customer successfully", async () => {
      mockRequest.body = { email: "tom@petty.com", password: "testPassw@rd1" }
      await postLoginCustomer(mockRequest, mockResponse, mockNext)

      expect(mockResponse.cookie).toHaveBeenCalledTimes(2)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.send).toHaveBeenCalled()
    })
  })

  describe("postLogoutCustomer", () => {
    test("Logout customer successfully", async () => {
      mockRequest.body = { email: "tom@petty.com", password: "testPassw@rd1" }
      await postLoginCustomer(mockRequest, mockResponse, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect.objectContaining({
        data: expect.objectContaining("tom@petty.com"),
      })

      await postLogoutCustomer(mockRequest, mockResponse, mockNext)

      expect(mockResponse.clearCookie).toHaveBeenCalledTimes(2)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect.objectContaining({
        message: expect.objectContaining("Customer logout"),
      })
    })

    test("No customer to logout", async () => {
      await postLogoutCustomer(mockRequest, mockResponse, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.send).toHaveBeenCalledWith({
        message: "No Customer to logout",
        statusCode: 200,
        success: true,
      })
    })
  })
})
