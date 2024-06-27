import paginationHandler from "utils/paginationHandler"

const count = 55
const pageSize = 20
const actualPage = 0

test("Returns limit and page values", () => {
  const { limit, page } = paginationHandler({
    count,
    pageSize,
    page: actualPage,
  })

  expect(limit).toStrictEqual(2)
  expect(page).toStrictEqual(0)
})

test("Prevents page to be greater than 'limit'", () => {
  const { limit, page } = paginationHandler({
    count,
    pageSize,
    page: 3,
  })

  expect(limit).toStrictEqual(2)
  expect(page).toStrictEqual(2)
})
