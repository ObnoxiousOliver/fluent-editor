import defaults from '../document/defaults'
import { Fill } from '../vector/Fill'
import hasChildren from './interfaces/hasChildren'
import hasFill from './interfaces/hasFill'
import hasRect from './interfaces/hasRect'
import Node from './Node'
import NodeTypes from './NodeTypes'
import Rect from './Rect'

export default class Frame extends Node implements hasRect, hasChildren, hasFill {
  rect: Rect
  children: Node[]
  fill: Fill

  constructor (children?: Node[], rect?: Rect, name?: string, id?: string) {
    super(NodeTypes.Frame, name, id)

    this.children = children ?? []
    this.rect = rect ?? new Rect(0, 0, 100, 100)

    this.fill = defaults().frame.fill
  }

  setRect (rect: Rect): this {
    this.rect = rect
    return this
  }

  setFill (fill: Fill): this {
    this.fill = fill
    return this
  }
}
