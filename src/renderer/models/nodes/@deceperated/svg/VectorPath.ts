export interface PathData {
  t: 'M' | 'L' | 'C',
  p: number[]
}

export default interface VectorPath {
  d: PathData[]
}
