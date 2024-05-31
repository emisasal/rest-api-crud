const paginationHandler = ({
  count,
  pageSize,
  page = 0,
}: {
  count: number
  pageSize: number
  page: number
}) => {
  const limit = Math.floor(count / pageSize)
  if (page > limit) {
    page = limit
  }

  return { limit, page }
}

export default paginationHandler
