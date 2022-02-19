import { PanelContentItemTypes } from './PanelContentItemTypes'

export default class PanelContentItem {
  type: PanelContentItemTypes
  value: object

  constructor (type: PanelContentItemTypes, value: object) {
    this.type = type
    this.value = value
  }
}
