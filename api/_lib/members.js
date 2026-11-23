export function normalizeMemberPhone(value) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (!trimmed || trimmed.length > 32) return null
  let digits = trimmed.replace(/[\s().-]/g, '')
  if (digits.startsWith('00')) digits = `+${digits.slice(2)}`
  if (digits.startsWith('+')) {
    if (!/^\+[1-9][0-9]{7,14}$/.test(digits)) return null
    return digits
  }
  if (!/^\d+$/.test(digits)) return null
  if (digits.startsWith('0')) digits = `62${digits.slice(1)}`
  else if (digits.startsWith('8')) digits = `62${digits}`
  if (!/^62[1-9][0-9]{6,12}$/.test(digits)) return null
  return `+${digits}`
}
