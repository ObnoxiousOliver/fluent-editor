import PanelContentItem from './PanelContentItem'

export default class Label extends PanelContentItem {
  declare value: {
    label: string
  }

  constructor (label: string) {
    super('label', { label })
  }
}
