import {
  globalErrorSchema,
  internalErrorSchema,
  notFoundSchema,
  unauthorizedSchema,
  unprocessableContent,
} from "./swaggerErrorSchemas"

export const getImageByIdDocs = {
  tags: ["Image"],
  summary: "Get image by Id",
  description: "Get book image by param Id",
  operationId: "getImageByIdDocs",
  parameters: [
    {
      in: "params",
      name: "id",
      description: "Image Id",
      schema: {
        type: "number",
      },
      required: true,
    },
  ],
  responses: {
    200: {
      description: "OK",
      content: {
        "image/jpeg": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
    400: globalErrorSchema(),
    401: unauthorizedSchema(),
    404: notFoundSchema("GET", "/api/image/:id"),
    422: unprocessableContent("Unable to get image 12.jpg"),
    500: internalErrorSchema,
  },
}
