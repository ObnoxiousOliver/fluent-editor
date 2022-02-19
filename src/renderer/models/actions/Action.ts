export default interface Action {
  id: string,
  name?: string,
  description?: string,
  executeInAppMenu?: boolean,
  keyboardShortcuts?: string[][],
  hooks?: Function[]
}
