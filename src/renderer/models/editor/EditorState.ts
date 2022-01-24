import { createDocument, FluentDocument } from '../document/FluentDocument'
import Selection, { createSelection } from './Selection'
import { Tool } from './Tools'

export default interface EditorState {
  mode: 'design' | 'animate',
  activeTool: Tool,
  activeSlide: number,
  document: FluentDocument,
  selection: Selection,
}

export function createEditorState (options: {
  document?: FluentDocument,
  activeSlide?: number
}) : EditorState {
  return {
    mode: 'design',
    activeTool: 'selection',
    activeSlide: options.activeSlide ?? 0,
    document: options.document ?? createDocument(),
    selection: createSelection()
  }
}
