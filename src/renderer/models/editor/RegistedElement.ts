import Node from '../nodes/Node'
import Rect from '../nodes/Rect'

export default interface RegistedElement {
  id: string,
  order?: number,
  node: Node,
  boundingBox: Rect,
  setBoundingBox: Function,
  snappingPoints: { x: number, y: number }[]
}
