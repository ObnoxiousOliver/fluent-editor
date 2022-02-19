import Rect from '../../Rect'

export default interface hasRect {
  rect: Rect,
  setRect(rect: Rect) : this
}
