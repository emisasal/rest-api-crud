import { mockNext, mockRequest, mockResponse } from "../../__mocks__"
import { getAuthorById } from "../author.controller"
import redis from "../../config/redisClient";

afterAll(async () => {
    await redis.quit();
});

// describe('getAllAuthors', () => {
//     it("Returns authors list", () => {
//     })
// })

// describe("getAuthorById", () => {
//   xit("Returns a single Author", async () => {
//     await getAuthorById(mockRequest, mockResponse, mockNext)

//     expect(mockResponse.send).toHaveBeenCalled()
//   })
// })
