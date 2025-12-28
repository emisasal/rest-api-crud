import request from "supertest"
import app from "../../app"
import redis from "../../config/redisClient"

const testUser = { email: "test@mail.com", password: "testPassw@rd1" }

describe("customerSession routes", () => {
    afterAll(async () => {
      await redis.quit()
    })

    describe("/customer/register", () => {
        test.skip("Register new user", () => {
            const response = request(app).post("/api/customer/register")
        })
    })
})

// test("/customer/login sign in user", async () => {
//   const response = await request(app)
//     .post("/api/customer/login")
//     .send({ email: "test@mail.com", password: "testPassw@rd1" })
//     .set("Accept", "application/json")
//     // .expect("Content-Type", /json/)

// //   console.log("response", response)

//   expect(response.statusCode).toBe(200)
//   // .expect(200)
//   // .expect("Content-Type", /json/)
// })
