export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isValidPassword(password: string): boolean {
  return !!password && password.length >= 6
}

export function isValidCron(expression: string): boolean {
  if (!expression) return false
  return /^([*?0-9,/-]+ ){4}[*?0-9,/-]+$/.test(expression.trim())
}
