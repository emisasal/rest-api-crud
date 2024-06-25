import { mockNext, mockRequest, mockResponse } from "../../__mocks__"
import { getAuthorById } from "../author.controller"

// describe('getAllAuthors', () => {
//     it("Returns authors list", () => {
//     })
// })

describe("getAuthorById", () => {
  xit("Returns a single Author", async () => {
    await getAuthorById(mockRequest, mockResponse, mockNext)

    expect(mockResponse.send).toHaveBeenCalled()
  })
})
