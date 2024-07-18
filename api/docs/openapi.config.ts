import type { Application } from "express"
import { OpenApi, Types } from "ts-openapi"

import * as bookDocs from "./book.docs"
import {
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
  unauthorizedSchema,
} from "./swaggerErrorSchemas"
import { bookData } from "./data"

// create an OpenApi instance to store definitions
export const openApi = new OpenApi(
  "v1.0", // API version
  "Rest-Api-Crud Documentation", // API title
  "API endpoints documentation for the project Rest-Api-Crud.", // API description
  "maintainer@domain.com" // API maintainer email
)

// declare servers for the API
openApi.setServers([
  {
    url: "http://localhost:8080",
    description: "Local Server",
  },
  {
    url: "https://api.productionapiexample.com",
    description: "Production Server",
  },
])

openApi.addPath(
  "/api/book",
  {
    get: {
      tags: ["Book"],
      summary: "Get books list",
      description: "Get books list by page, order and filters",
      operationId: "getAllBooksDoc",
      responses: {
        200: openApi.declareSchema(
          "OK",
          Types.Object({
            description: "OK",
            properties: {
              success: Types.Boolean({
                description: "Response successful",
              }),
              statusCode: Types.Integer({
                description: "Response status code",
              }),
              data: Types.Array({
                description: "Array of book objects",
                arrayType: Types.Object({
                  properties: {
                    book_id: Types.Integer(),
                    title: Types.String(),
                    description: Types.String(),
                    author_id: Types.Integer(),
                    genre_id: Types.Integer(),
                    publisher_id: Types.Integer(),
                    price: Types.String(),
                    publish_date: Types.Date(),
                    isbn: Types.String(),
                    author: {
                      author_id: Types.Integer(),
                      first_name: Types.String(),
                      last_name: Types.String(),
                      bio: Types.String(),
                    },
                    genre: {
                      genre_id: Types.Integer(),
                      name: Types.String(),
                      description: Types.String(),
                    },
                    publisher: {
                      publisher_id: Types.Integer(),
                      publisher_name: Types.String(),
                      contact_name: Types.String(),
                      phone_number: Types.String(),
                    },
                  },
                }),
              }),
              count: Types.Integer({
                description: "Total amount of list elements",
              }),
              page: Types.Integer({
                description: "Actual page number",
              }),
              limit: Types.Integer({
                description: "Last page number of the list",
              }),
              cache: Types.Boolean({
                description: "Indicates if 'data' is returned from cache",
              }),
            },
            example: {
              success: true,
              statusCode: 200,
              data: [bookData],
              count: 732,
              page: 0,
              limit: 12,
              cache: true,
            },
          })
        ),
        400: openApi.declareSchema(
          "Error getting data",
          globalErrorSchema("Error getting books")
        ),
        401: openApi.declareSchema("Unauthorized", unauthorizedSchema()),
        404: openApi.declareSchema(
          "Route not found",
          notFoundSchema("GET", "/api/book")
        ),
        500: openApi.declareSchema(
          "Internal Server Error",
          internalErrorSchema
        ),
      },
    },
  },
  true
)

export const openApiJson = openApi.generateJson()

// export function initOpenApi(app: Application, openApi: OpenApi) {
//   // generate our OpenApi schema
//   const openApiJson = openApi.generateJson()

//   // we'll create an endpoint to reply with openapi schema
//   app.get("/openapi.json", function (_req, res) {
//     res.json(openApiJson)
//   })
//   // this will make openapi UI available with our definition
//   app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiJson))
// }
