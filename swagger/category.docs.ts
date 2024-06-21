import { categoryListDoc, modelsListData } from "./data/categoryData"
import {
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
} from "./swaggerErrorSchemas"

// @route /api/category
export const getModelsDoc = {
  tags: ["Category"],
  summary: "Get db models list",
  description: "Get list  of db models (tables)",
  operationId: "getModelsDoc",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description: "Response successful",
                example: true,
              },
              statusCode: {
                type: "number",
                description: "Response status code",
                example: 200,
              },
              data: {
                type: "array",
                description: "Array of model names",
                example: modelsListData,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Error getting models list"),
    404: notFoundSchema("GET", "/api/category"),
    500: internalErrorSchema,
  },
}

// @route /api/category/:name
export const getCategoryDoc = {
  tags: ["Category"],
  summary: "Get models categories (table columns) list",
  description: "Get list of model categories (columns)",
  operationId: "getCategoryDoc",
  parameters: [
    {
      in: "params",
      name: "name",
      description: "Model name",
      required: "true",
      schema: {
        type: "string",
      },
    },
  ],
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              success: {
                type: "boolean",
                description: "Response successful",
                example: true,
              },
              statusCode: {
                type: "number",
                description: "Response status code",
                example: 200,
              },
              data: {
                type: "array",
                description: "Array of model names",
                example: categoryListDoc,
              },
            },
          },
        },
      },
    },
    400: globalErrorSchema("Error getting categories list"),
    404: notFoundSchema("GET", "/api/category/:name"),
    500: internalErrorSchema,
  },
}
