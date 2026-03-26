const WEEKDAY_MAP: Record<number, string> = {
  0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday',
  4: 'Thursday', 5: 'Friday', 6: 'Saturday'
}

const MONTH_MAP: Record<number, string> = {
  1: 'January', 2: 'February', 3: 'March', 4: 'April',
  5: 'May', 6: 'June', 7: 'July', 8: 'August',
  9: 'September', 10: 'October', 11: 'November', 12: 'December'
}

function formatList(values: string, map: Record<number, string>): string {
  const items = values.split(',').map(v => map[Number(v)] || v)
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export function cronToHuman(expr: string): string {
  if (!expr || !/^([*?0-9,/-]+ ){4}[*?0-9,/-]+$/.test(expr.trim())) {
    return 'Invalid cron expression'
  }

  const [min, hour, day, month, weekday] = expr.trim().split(' ')

  // Common presets
  if (expr.trim() === '* * * * *') return 'Every minute'
  if (expr.trim() === '0 * * * *') return 'Every hour'
  if (expr.trim() === '0 0 * * *') return 'Every day at midnight'
  if (expr.trim() === '0 12 * * *') return 'Every day at noon'

  const parts: string[] = []

  // Minutes
  if (min === '*') {
    parts.push('Every minute')
  } else if (min === '0') {
    parts.push('At the start of the hour')
  } else if (min.includes(',')) {
    parts.push(`At minutes ${min.split(',').join(', ')}`)
  } else {
    parts.push(`At minute ${min}`)
  }

  // Hours
  if (hour !== '*') {
    if (hour.includes(',')) {
      const hours = hour.split(',')
      if (hours.length <= 3) {
        parts.push(`at ${hours.map(h => `${h}h`).join(', ')}`)
      } else {
        parts.push(`at ${hours.length} specific times`)
      }
    } else {
      parts.push(`at ${hour}h`)
    }
  }

  // Days of month
  if (day !== '*' && day !== '?') {
    if (day.includes(',')) {
      const days = day.split(',')
      if (days.length <= 5) {
        parts.push(`on days ${days.join(', ')}`)
      } else {
        parts.push(`on ${days.length} specific days of the month`)
      }
    } else {
      parts.push(`on day ${day}`)
    }
  }

  // Months
  if (month !== '*') {
    if (month.includes(',')) {
      const months = month.split(',')
      if (months.length <= 6) {
        parts.push(`in ${formatList(month, MONTH_MAP)}`)
      } else {
        parts.push(`in ${months.length} specific months`)
      }
    } else {
      parts.push(`in ${MONTH_MAP[Number(month)] || month}`)
    }
  }

  // Weekdays
  if (weekday !== '*' && weekday !== '?') {
    if (weekday.includes(',')) {
      const days = weekday.split(',')
      if (days.length <= 4) {
        parts.push(`on ${formatList(weekday, WEEKDAY_MAP)}`)
      } else {
        parts.push('on multiple weekdays')
      }
    } else {
      parts.push(`on ${WEEKDAY_MAP[Number(weekday)] || weekday}`)
    }
  }

  const result = parts.join(', ')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export function parseCronField(field: string): string[] {
  if (field === '*') return ['*']
  if (field === '?') return ['?']
  return field.split(',')
}

export function buildCronField(values: string[] | null | undefined): string {
  if (!values || values.length === 0 || values.includes('*')) return '*'
  if (values.includes('?')) return '?'
  return values.join(',')
}
