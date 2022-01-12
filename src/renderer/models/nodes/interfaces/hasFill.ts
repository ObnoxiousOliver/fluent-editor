import { Fill } from '../../vector/Fill'

export default interface hasFill {
  fill: Fill,
  setFill(fill: Fill) : this
}
