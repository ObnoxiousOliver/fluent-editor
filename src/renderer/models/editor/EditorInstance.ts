import EditorState from './EditorState'

export default interface EditorInstance {
  id: string,
  documentName?: string | number | null,
  filePath?: string | null,
  state: EditorState,
  history?: EditorState[]
}
