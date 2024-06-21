import { categoryListDoc, modelsListData } from "./data/categoryData"
import {
  dbErrorSchema,
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
      description: "Success getting models list",
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
    400: globalErrorSchema,
    404: notFoundSchema("GET", "/api/category"),
    409: dbErrorSchema("Error getting models list"),
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
      description: "Success getting categories list",
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
    400: globalErrorSchema,
    404: notFoundSchema("GET", "/api/category/:name"),
    409: dbErrorSchema("Error getting categories list"),
    500: internalErrorSchema,
  },
}
