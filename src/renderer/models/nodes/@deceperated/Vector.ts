import { Fill } from '../../vector/Fill'
import Stroke from '../../vector/Stroke'
import hasFill from './interfaces/hasFill'
import hasRect from './interfaces/hasRect'
import hasStroke from './interfaces/hasStroke'
import hasVector from './interfaces/hasVector'
import Node from '../Node'
import NodeTypes from './NodeTypes'
import Rect from '../Rect'
import { VectorType } from './svg/VectorType'

export default class Vector extends Node implements hasRect, hasFill, hasStroke, hasVector {
  rect: Rect
  fill: Fill
  vectorType: VectorType
  vectorData: object | null
  stroke: Stroke | null

  constructor (name?: string, id?: string) {
    super(NodeTypes.Vector, {}, new Rect(), name, id)
    this.rect = new Rect()
    this.fill = null
    this.vectorType = 'rect'
    this.vectorData = null
    this.stroke = null
  }

  setRect (rect: Rect): this {
    this.rect = rect
    return this
  }

  setFill (fill: Fill): this {
    this.fill = fill
    return this
  }

  setVector (type: VectorType, data: object | null = null): this {
    this.vectorType = type
    this.vectorData = data
    return this
  }

  setStroke (stroke: Stroke): this {
    this.stroke = stroke
    return this
  }

  // setStrokeFill (fill: Fill): this {
  //   if (!this.stroke) this.setStroke(createStroke(fill))
  //   else this.stroke.fill = fill
  //   return this
  // }

  // setStrokeWidth (width: number): this {
  //   if (!this.stroke) return this
  //   this.stroke.width = width
  //   return this
  // }

  // setStrokeLineCap (lineCap: CanvasLineCap): this {
  //   if (!this.stroke) return this
  //   this.stroke.lineCap = lineCap
  //   return this
  // }

  // setStrokeLineJoin (lineJoin: CanvasLineJoin): this {
  //   if (!this.stroke) return this
  //   this.stroke.lineJoin = lineJoin
  //   return this
  // }

  // setStrokeDashArray (dashArray: number[]): this {
  //   if (!this.stroke) return this
  //   this.stroke.dashArray = dashArray
  //   return this
  // }

  // setStrokeDashOffset (dashOffset: number): this {
  //   if (!this.stroke) return this
  //   this.stroke.dashOffset = dashOffset
  //   return this
  // }
}
