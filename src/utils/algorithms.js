export const pagingSkipValue = (page, limit) => {
  if (!page || !limit || page <= 0 || limit <= 0) return 0
  return (page - 1) * limit
}
