const WEEKDAY_MAP = {
  0: 'Domingo', 1: 'Segunda', 2: 'Terça', 3: 'Quarta',
  4: 'Quinta', 5: 'Sexta', 6: 'Sábado'
}

const MONTH_MAP = {
  1: 'Janeiro', 2: 'Fevereiro', 3: 'Março', 4: 'Abril',
  5: 'Maio', 6: 'Junho', 7: 'Julho', 8: 'Agosto',
  9: 'Setembro', 10: 'Outubro', 11: 'Novembro', 12: 'Dezembro'
}

function formatList(values, map) {
  const items = values.split(',').map(v => map[v] || v)
  if (items.length === 1) return items[0]
  if (items.length === 2) return `${items[0]} e ${items[1]}`
  return `${items.slice(0, -1).join(', ')} e ${items[items.length - 1]}`
}

function isSundayOrSaturday(day) {
  return day === '0' || day === '6'
}

export function cronToHuman(expr) {
  if (!expr || !/^([*?0-9,/-]+ ){4}[*?0-9,/-]+$/.test(expr.trim())) {
    return 'Expressão cron inválida'
  }

  const [min, hour, day, month, weekday] = expr.trim().split(' ')

  // Common presets
  if (expr.trim() === '* * * * *') return 'A cada minuto'
  if (expr.trim() === '0 * * * *') return 'A cada hora'
  if (expr.trim() === '0 0 * * *') return 'Todos os dias à meia-noite'
  if (expr.trim() === '0 12 * * *') return 'Todos os dias ao meio-dia'

  const parts = []

  // Minutes
  if (min === '*') {
    parts.push('A cada minuto')
  } else if (min === '0') {
    parts.push('No início da hora')
  } else if (min.includes(',')) {
    parts.push(`Nos minutos ${min.split(',').join(', ')}`)
  } else {
    parts.push(`No minuto ${min}`)
  }

  // Hours
  if (hour !== '*') {
    if (hour.includes(',')) {
      const hours = hour.split(',')
      if (hours.length <= 3) {
        parts.push(`às ${hours.map(h => `${h}h`).join(', ')}`)
      } else {
        parts.push(`em ${hours.length} horários específicos`)
      }
    } else {
      parts.push(`às ${hour}h`)
    }
  }

  // Days of month
  if (day !== '*' && day !== '?') {
    if (day.includes(',')) {
      const days = day.split(',')
      if (days.length <= 5) {
        parts.push(`nos dias ${days.join(', ')}`)
      } else {
        parts.push(`em ${days.length} dias específicos do mês`)
      }
    } else {
      parts.push(`no dia ${day}`)
    }
  }

  // Months
  if (month !== '*') {
    if (month.includes(',')) {
      const months = month.split(',')
      if (months.length <= 6) {
        parts.push(`em ${formatList(month, MONTH_MAP)}`)
      } else {
        parts.push(`em ${months.length} meses específicos`)
      }
    } else {
      parts.push(`em ${MONTH_MAP[month] || month}`)
    }
  }

  // Weekdays
  if (weekday !== '*' && weekday !== '?') {
    if (weekday.includes(',')) {
      const days = weekday.split(',')
      if (days.length <= 4) {
        const prep = isSundayOrSaturday(days[0]) ? 'aos' : 'nas'
        parts.push(`${prep} ${formatList(weekday, WEEKDAY_MAP)}`)
      } else {
        parts.push('em vários dias da semana')
      }
    } else {
      const prep = isSundayOrSaturday(weekday) ? 'aos' : 'nas'
      parts.push(`${prep} ${WEEKDAY_MAP[weekday] || weekday}`)
    }
  }

  const result = parts.join(', ')
  return result.charAt(0).toUpperCase() + result.slice(1)
}

export function parseCronField(field) {
  if (field === '*') return ['*']
  if (field === '?') return ['?']
  return field.split(',')
}

export function buildCronField(values) {
  if (!values || values.length === 0 || values.includes('*')) return '*'
  if (values.includes('?')) return '?'
  return values.join(',')
}
