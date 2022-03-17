import { createDocument, FluentDocument } from '../document/FluentDocument'
import Selection, { createSelection } from './Selection'

export default interface EditorState {
  mode: 'design' | 'animate',
  activeTool: string,
  activeSlide: number,
  document: FluentDocument,
  selection: Selection,
  openPropertyPanels: {
    [x: string]: boolean
  },
  canvas: {
    fixToScreen: boolean,
    scale: number,
    posX: number,
    posY: number
  }
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
    selection: createSelection(),
    openPropertyPanels: {
      layout: true
    },
    canvas: {
      fixToScreen: true,
      scale: 1,
      posX: 0,
      posY: 0
    }
  }
}
