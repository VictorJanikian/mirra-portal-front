export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password) {
  return password && password.length >= 6
}

export function isValidCron(expression) {
  if (!expression) return false
  return /^([*?0-9,/-]+ ){4}[*?0-9,/-]+$/.test(expression.trim())
}
