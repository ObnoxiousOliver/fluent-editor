export interface Stop {
  offset: number,
  color: string
}

export default interface Gradient {
  type: 'radial' | 'linear',
  stops: Stop[],
  x1: number,
  y1: number,
  x2: number,
  y2: number
}
