import { Application } from "express"
import { OpenApi } from "ts-openapi"
import swaggerUi from "swagger-ui-express"

import * as bookDocs from "./book.docs"
import { internalErrorSchema } from "./swaggerErrorSchemas"

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
          // 200: {
          //   description: "OK",
          //   content: {
          //     "application/json": {
          //       schema: {
          //         type: "object",
          //         properties: {
          //           success: {
          //             type: "boolean",
          //             description: "Response successful",
          //             example: true,
          //           },
          //           statusCode: {
          //             type: "number",
          //             description: "Response status code",
          //             example: 200,
          //           },
          //           data: {
          //             type: "array",
          //             description: "Array of book objects",
          //             example: [bookData],
          //           },
          //           count: {
          //             type: "number",
          //             description: "Total amount of list elements",
          //             example: 732,
          //           },
          //           page: {
          //             type: "number",
          //             description: "Actual page number",
          //             example: 0,
          //           },
          //           limit: {
          //             type: "number",
          //             description: "Last page number of the list",
          //             example: 12,
          //           },
          //           cache: {
          //             type: "boolean",
          //             description: "Indicates if 'data' is returned from cache",
          //             example: true,
          //           },
          //         },
          //       },
          //     },
          //   },
          // },
          // 400: globalErrorSchema("Error getting books"),
          // 401: unauthorizedSchema(),
          // 404: notFoundSchema("GET", "/api/book"),
          500: openApi.declareSchema("Internal Server Error", internalErrorSchema),
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
