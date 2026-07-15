export const formatUSPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10)
  const areaCode = digits.slice(0, 3)
  const prefix = digits.slice(3, 6)
  const lineNumber = digits.slice(6, 10)

  if (digits.length > 6) {
    return `(${areaCode}) ${prefix}-${lineNumber}`
  }

  if (digits.length > 3) {
    return `(${areaCode}) ${prefix}`
  }

  if (digits.length > 0) {
    return `(${areaCode}`
  }

  return ''
}
