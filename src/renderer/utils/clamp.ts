export default function clamp (value: number, min: number = 0, max: number = 1) {
  return Math.max(min, Math.min(value, max))
}
