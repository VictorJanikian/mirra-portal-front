export function getTimezoneOffsetMinutes(timezone: string): number {
  if (!timezone || timezone === 'UTC') return 0
  try {
    const now = new Date()
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
    return Math.round((tzDate.getTime() - utcDate.getTime()) / 60000)
  } catch {
    return 0
  }
}

function parseNumList(field: string): number[] | null {
  if (field === '*' || field === '?') return null
  const parts = field.split(',').map(v => v.trim())
  if (parts.some(p => !/^\d+$/.test(p))) return null
  return parts.map(v => parseInt(v, 10))
}

function formatNumList(list: number[]): string {
  return [...new Set(list)].sort((a, b) => a - b).join(',')
}

function mod(n: number, m: number): number {
  return ((n % m) + m) % m
}

export function shiftCronByMinutes(cron: string, offsetMinutes: number): string {
  if (!cron || offsetMinutes === 0) return cron
  const parts = cron.trim().split(/\s+/)
  if (parts.length < 5) return cron
  const [minField, hourField, domField, monthField, dowField] = parts

  const minutes = parseNumList(minField)
  if (minutes === null || minutes.length === 0) return cron

  const baseMinute = minutes[0]
  const hours = parseNumList(hourField)

  let newMinuteField: string
  let newHourField: string
  const dayShifts = new Set<number>()

  if (hours === null) {
    const total = baseMinute + offsetMinutes
    newMinuteField = String(mod(total, 60))
    newHourField = hourField
  } else {
    const newHours: number[] = []
    let resultMinute = baseMinute
    for (const h of hours) {
      const total = h * 60 + baseMinute + offsetMinutes
      const minutesOfDay = mod(total, 1440)
      newHours.push(Math.floor(minutesOfDay / 60))
      resultMinute = minutesOfDay % 60
      dayShifts.add(Math.floor(total / 1440))
    }
    newMinuteField = String(resultMinute)
    newHourField = formatNumList(newHours)
  }

  const shift = dayShifts.size === 1 ? (dayShifts.values().next().value ?? 0) : 0

  const weekdays = parseNumList(dowField)
  let newDowField = dowField
  if (weekdays !== null && shift !== 0) {
    newDowField = formatNumList(weekdays.map(d => mod(d + shift, 7)))
  }

  const daysOfMonth = parseNumList(domField)
  let newDomField = domField
  if (daysOfMonth !== null && shift !== 0) {
    newDomField = formatNumList(daysOfMonth.map(d => mod(d - 1 + shift, 31) + 1))
  }

  return `${newMinuteField} ${newHourField} ${newDomField} ${monthField} ${newDowField}`
}

export function cronUtcToTimezone(cron: string, timezone: string): string {
  return shiftCronByMinutes(cron, getTimezoneOffsetMinutes(timezone))
}

export function cronTimezoneToUtc(cron: string, timezone: string): string {
  return shiftCronByMinutes(cron, -getTimezoneOffsetMinutes(timezone))
}
