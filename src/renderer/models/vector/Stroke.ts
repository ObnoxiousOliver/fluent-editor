import { Fill } from './Fill'

export type StrokeLocation = 'inside' | 'center' | 'outside' | null

export default interface Stroke {
  fill: Fill,
  width: number,
  location: StrokeLocation,
  lineCap: CanvasLineCap | null,
  lineJoin: CanvasLineJoin | null,
  dashArray: number[] | null,
  dashOffset: number | null
}

export function createStroke (
  fill: Fill,
  width?: number,
  location?: StrokeLocation,
  lineCap?: CanvasLineCap,
  lineJoin?: CanvasLineJoin,
  dashArray?: number[],
  dashOffset?: number) : Stroke {
  return {
    fill: fill ?? null,
    width: width ?? 2,
    location: location ?? 'center',
    lineCap: lineCap ?? null,
    lineJoin: lineJoin ?? null,
    dashArray: dashArray ?? null,
    dashOffset: dashOffset ?? null
  }
}
