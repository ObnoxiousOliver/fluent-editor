import PanelContentItem from './PanelContentItem'

export interface NumberInputValue {
  name: string,
  value: number | null | (number | null)[],
  set (value: number | null | (number | null)[]): void
  nullable?: boolean,
  unit?: null | string | string[],
  default(): number | null,
  dragRatio?: number
}

export default class NumberInput extends PanelContentItem {
  declare value: NumberInputValue

  constructor (options: NumberInputValue) {
    super('number', options)
  }
}

export type NumberValueType = number | null | (number | null)[]
