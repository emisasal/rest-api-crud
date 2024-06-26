import request from "supertest"
import { type Express } from "express-serve-static-core"
import { singletonApp } from "../../server"

describe("/api/image/:id", () => {
  const app: Express = singletonApp()

  xit("Returns an image", async () => {
    const res = await request(app).get("/api/image/1")
    expect(res.status).toEqual(200)
  })
})
