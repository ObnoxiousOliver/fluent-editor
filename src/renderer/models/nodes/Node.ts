import randomId from '../../utils/randomId'
import NodeTypes from './NodeTypes'

export default class Node {
  id: string
  name: string
  type: NodeTypes

  constructor (type: NodeTypes, name: string = '', id?: string) {
    this.id = id ?? randomId()
    this.name = name
    this.type = type
  }
}
