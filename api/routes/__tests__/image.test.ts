import request from "supertest"
import express from "express"

const app = express()

describe("/api/image/:id", () => {
  it("Returns an image", async () => {
    const res = await request(app).get("/api/image/1")
    expect(res.status).toEqual(200)
  })
})
