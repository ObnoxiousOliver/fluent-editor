import PanelContentItem from './PanelContentItem'

export class Panel {
  name: string
  id: string
  content: PanelContentItem[]
  order: number

  constructor (name: string, id: string, content: PanelContentItem[], order: number = 0) {
    this.name = name
    this.id = id
    this.content = content
    this.order = order
  }
}

export type Properties = Panel[]
