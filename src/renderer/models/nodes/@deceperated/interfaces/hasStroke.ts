import Stroke from '../../../vector/Stroke'

export default interface hasStroke {
  stroke: Stroke | null,
  setStroke(stroke: Stroke) : this
  // setStrokeFill(fill: Fill) : this
  // setStrokeWidth(width: number) : this
  // setStrokeLineCap(lineCap: CanvasLineCap) : this
  // setStrokeLineJoin(lineJoin: CanvasLineJoin) : this
  // setStrokeDashArray(dashArray: number[]) : this
  // setStrokeDashOffset(dashOffset: number) : this
}
