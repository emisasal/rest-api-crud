import { clearRedisCache } from "__mocks__/clearRedisCache"
import { mockNext, mockRequest, mockResponse } from "../../__mocks__"
import { getAllAuthors, getAuthorById } from "../author.controller"
import { registeredCustomer } from "__mocks__/customerMocks"
import {
  postLoginCustomer,
  postRegisterCustomer,
} from "controllers/customerSession.controller"
import { prisma } from "config/prismaClient"
import CustomError from "classes/CustomError"
import matchError from "__mocks__/matchError"

describe("Author controller", () => {
  beforeAll(async () => {
    mockRequest.body = registeredCustomer
    await postRegisterCustomer(mockRequest, mockResponse, mockNext)

    mockRequest.body = { email: "tom@petty.com", password: "testPassw@rd1" }
    await postLoginCustomer(mockRequest, mockResponse, mockNext)
  })

  beforeEach(async () => {
    await clearRedisCache()
  })

  afterAll(async () => {
    await prisma.customer.delete({
      where: {
        email: "tom@petty.com",
      },
    })
  })

  describe("getAllAuthors", () => {
    test.skip("Returns error 422 if data not validated", async () => {
      await getAllAuthors(mockRequest, mockResponse, mockNext)

      const errorValidation = new Error() as CustomError
      errorValidation.message =
        "Cannot read properties of undefined (reading 'replace')"
      errorValidation.status = 422

      expect(mockNext).toHaveBeenCalledWith(
        matchError(422, "Cannot read properties of undefined (reading 'page')")
      )
    })

    test.skip("Returns Authors list", async () => {
      mockRequest.query = { page: "0" }
      await getAllAuthors(mockRequest, mockResponse, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.send).toHaveBeenCalled()
    })
  })

  describe("getAuthorById", () => {
    test.skip("Returns error 400 if Author not found", async () => {
      mockRequest.params = { id: "10500" }

      await getAuthorById(mockRequest, mockResponse, mockNext)

      expect(mockNext).toHaveBeenCalledWith(matchError(400, "Author not found"))
    })

    test.skip("Returns Author by Id param", async () => {
      mockRequest.params = { id: "1" }

      await getAuthorById(mockRequest, mockResponse, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.send).toHaveBeenCalled()
    })
  })

  describe("postAuthor", () => {})

  describe("patchAuthorById", () => {})

  describe("deleteAuthor", () => {})
})
