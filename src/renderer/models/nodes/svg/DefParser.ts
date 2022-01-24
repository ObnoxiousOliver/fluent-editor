import DefComponent from './DefComponent'

export default interface DefParser {
  types: string[]
  parse(def: object, id: string, key: string): DefComponent
}
