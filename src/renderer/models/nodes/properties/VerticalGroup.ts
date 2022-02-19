import PanelContentItem from './PanelContentItem'

export default class VerticalGroup extends PanelContentItem {
  declare value: {
    content: PanelContentItem[]
  }

  constructor (content: PanelContentItem[]) {
    super('vertical-group', { content })
  }
}
