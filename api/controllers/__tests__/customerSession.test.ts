import { mockRequest, mockResponse, mockNext } from "__mocks__"
import { postRegisterCustomer } from "controllers/customerSession.controller"
import redis from "../../config/redisClient"
import { prisma } from "config/prismaClient"
import CustomError from "classes/CustomError"

jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: jest.fn(() => false),
    array: jest.fn(() => []),
  })),
}))

describe("customerSession", () => {
  afterAll(async () => {
    await redis.quit()
  })

  describe("postRegisterCustomer", () => {
    test("Returns 422 error if data not validated", async () => {
      mockRequest.body = {}

      await postRegisterCustomer(mockRequest, mockResponse, mockNext)

      const errorValidation = new Error() as CustomError
      errorValidation.message =
        "Cannot read properties of undefined (reading 'replace')"
      errorValidation.status = 422

      expect(mockNext).toHaveBeenCalledWith(errorValidation)
    })

    test("Returns error if customer exist", async () => {
      mockRequest.body = {
        first_name: "Lory",
        last_name: "Littell",
        email: "littell@webnode.com",
        password: "testPassw@rd1",
      }
      await postRegisterCustomer(mockRequest, mockResponse, mockNext)

      const errorAlreadyCreated = new Error() as CustomError
      errorAlreadyCreated.message = "Customer already registered"
      errorAlreadyCreated.status = 400

      expect(mockNext).toHaveBeenCalledWith(errorAlreadyCreated)
    })

    test("Registers new customer", async () => {
      const customerExist = await prisma.customer.findFirst({
        where: {
          email: "bob@dylan.com",
        },
      })
      if (customerExist) {
        await prisma.customer.delete({
          where: {
            customer_id: customerExist.customer_id,
          },
        })
      }

      mockRequest.body = {
        first_name: "Bob",
        last_name: "Dylan",
        email: "bob@dylan.com",
        password: "testPassw@rd1",
      }

      await postRegisterCustomer(mockRequest, mockResponse, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.send).toHaveBeenCalled()
    })
  })
})
