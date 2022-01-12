export default class Rect {
  x: number
  y: number
  width: number | null
  height: number | null

  constructor (
    x: number = 0,
    y: number = 0,
    width: number | null = null,
    height: number | null = null) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }
}
