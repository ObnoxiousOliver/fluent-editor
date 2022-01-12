import hasRect from './interfaces/hasRect'
import Node from './Node'
import NodeTypes from './NodeTypes'
import Rect from './Rect'

export class Vector extends Node implements hasRect {
  rect: Rect

  constructor (rect?: Rect, name?: string, id?: string) {
    super(NodeTypes.Vector, name, id)
    this.rect = rect ?? new Rect()
  }

  setRect (rect: Rect): this {
    this.rect = rect
    return this
  }
}
