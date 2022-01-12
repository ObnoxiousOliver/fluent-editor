export interface Stop {
  offset: Number,
  color: String
}

export default interface Gradient {
  type: 'radial' | 'linear',
  stops: Stop[]
}
