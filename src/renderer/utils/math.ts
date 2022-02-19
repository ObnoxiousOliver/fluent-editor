export function clamp (value: number, min: number = 0, max: number = 1) {
  return Math.max(min, Math.min(value, max))
}

export function roundDecimalPlaces (num: number, count: number = 1) {
  if (count <= 0) return parseInt(Math.round(num).toFixed(0))

  const a = 10 ** count
  return parseFloat((Math.round((num + Number.EPSILON) * a) / a).toFixed(count))
}
