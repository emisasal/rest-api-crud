import generateRandomString from "utils/generateRandomString"

const stringLength = 24

test("Returns a random string", () => {
  const randomString = generateRandomString(stringLength)

  expect(typeof randomString).toBe("string")
  expect(randomString).toHaveLength(stringLength)
})
