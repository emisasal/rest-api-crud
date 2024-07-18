import request from "supertest"
import app from "../../app"
import { customerData } from "../../docs/data"
import redis from "../../config/redisClient"

afterAll(async () => {
  await redis.quit()
})

// let testRequest

// beforeEach(async () => {
//    testRequest = request(app)

//     await testRequest.post("/api/customer/login").send(customerData).expect(200)
// })

describe("/api/category", () => {
  test.todo("Returns models list")
  
  //     // beforeAll(async () => {
  //     //     const res = await request(app)
  //     // })
  //   it("Returns models list", () => {
  //     return testRequest.get("/api/category")
  //     //   .get("/api/category").set("Cookie", ["access_token=someCookieValue,;refresh_token=someRefreshToken"]).send(customerData)
  //     //   const cookies = res.headers["set-cookie"]
  //     //   console.log(cookies)
  //     //   .expect("Content-Type", /json/)

  //     expect(res.statusCode).toEqual(200)
  //   })
})
