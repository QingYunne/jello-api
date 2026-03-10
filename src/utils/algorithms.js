export const pagingSkipValue = (page, limit) => {
  if (!page || !limit || page <= 0 || limit <= 0) return 0
  return (page - 1) * limit
}

export function removeNil(obj) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null))
}

export const updateNestedObjectParser = (obj) => {
  const input = removeNil(obj)

  const final = {}
  Object.keys(input).forEach((k) => {
    const value = input[k]
    if (typeof value === 'object' && !Array.isArray(value)) {
      const response = updateNestedObjectParser(value)
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a]
      })
    } else {
      final[k] = value
    }
  })
  return final
}
