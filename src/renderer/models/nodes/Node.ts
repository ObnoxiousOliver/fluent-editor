import randomId from '../../utils/randomId'
import defaults from '../document/defaults'
import NodeTypes from './NodeTypes'
import NumberInput from './properties/NumberInput'
import RegistedElement from '../editor/RegistedElement'
import { Panel } from './properties/Properties'
import VerticalGroup from './properties/VerticalGroup'
import Rect from './Rect'
import Label from './properties/Label'

export default class Node {
  id: string
  name: string
  rect: Rect
  value: object
  type: NodeTypes

  constructor (
    type: NodeTypes,
    value: object,
    rect: Rect,
    name: string = '',
    id?: string) {
    this.id = id ?? randomId()
    this.name = name
    this.type = type
    this.value = value
    this.rect = rect
  }

  setRect (rect: Rect) {
    this.rect = rect
    return this
  }
}

export function nodeProps (elements: (RegistedElement | null)[]) {
  return elements.length ? [
    new Panel('properties.layout.name', 'layout', [
      new VerticalGroup([
        new NumberInput({
          name: 'properties.layout.x',
          value: elements.map(element => element?.node.rect.x ?? defaults().node.x),
          set: (value) => elements.forEach((element, i) => {
            if (element && value !== null) {
              element.node.rect.x = (Array.isArray(value) ? value?.[i] : value) ?? defaults().node.x
            }
          }),
          unit: 'px',
          default: () => defaults().node.x
        }),
        new NumberInput({
          name: 'properties.layout.y',
          value: elements.map(element => element?.node.rect.y ?? defaults().node.y),
          set: (value) => elements.forEach((element, i) => {
            if (element && value !== null) {
              element.node.rect.y = (Array.isArray(value) ? value?.[i] : value) ?? defaults().node.y
            }
          }),
          unit: 'px',
          default: () => defaults().node.y
        })
      ]),
      new VerticalGroup([
        new NumberInput({
          name: 'properties.layout.w',
          value: elements.map(element => element?.node.rect.width ?? null),
          set: (value) => elements.forEach((element, i) => {
            if (element) {
              element.node.rect.width = Array.isArray(value) ? value?.[i] : value
            }
          }),
          nullable: true,
          unit: 'px',
          default: () => defaults().node.width
        }),
        new NumberInput({
          name: 'properties.layout.h',
          value: elements.map(element => element?.node.rect.height ?? null),
          set: (value) => elements.forEach((element, i) => {
            if (element) {
              element.node.rect.height = Array.isArray(value) ? value?.[i] : value
            }
          }),
          nullable: true,
          unit: 'px',
          default: () => defaults().node.height
        })
      ])
    ], 0),
    new Panel('properties.transform.name', 'transform', [
      new Label('properties.transform.translate'),
      new VerticalGroup([
        new NumberInput({
          name: 'properties.layout.x',
          value: 0,
          set () {},
          unit: 'px',
          default: () => defaults().node.x
        }),
        new NumberInput({
          name: 'properties.layout.y',
          value: 0,
          set () {},
          unit: 'px',
          default: () => defaults().node.y
        })
      ]),
      new Label('properties.transform.scale'),
      new VerticalGroup([
        new NumberInput({
          name: 'properties.layout.x',
          value: 0,
          set () {},
          default: () => defaults().node.width
        }),
        new NumberInput({
          name: 'properties.layout.y',
          value: 0,
          set () {},
          default: () => defaults().node.height
        })
      ])
    ], 100)
  ] : []
}
