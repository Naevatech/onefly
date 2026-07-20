// Duffel returns durations as ISO 8601, e.g. "PT7H10M" — parse to "7h 10m".
export const formatDuration = (iso: string) => {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/)
  if (!match) return iso
  const hours = match[1] ? `${match[1]}h` : ''
  const minutes = match[2] ? `${match[2]}m` : ''
  return [hours, minutes].filter(Boolean).join(' ') || iso
}

// "2026-11-08T12:10:00" → "08 Nov, 12:10"
export const formatDateTime = (iso: string) => {
  const date = new Date(iso)
  const datePart = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
  const timePart = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  return `${datePart}, ${timePart}`
}

export const formatPrice = (amount: string, currency: string) => {
  const value = Number(amount)
  if (Number.isNaN(value)) return amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export const stopsLabel = (stops: number) =>
  stops === 0 ? 'Direct' : stops === 1 ? '1 stop' : `${stops} stops`