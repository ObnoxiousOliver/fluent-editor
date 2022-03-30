import createTextNode from '@/renderer/models/nodes/TextNode'
import EditorState from '@/renderer/models/editor/EditorState'
import { defineTool } from '@/renderer/models/editor/tools/Tool'
import Rect from '@/renderer/models/nodes/Rect'
import CreateTextBoxOverlay from './CreateTextBoxOverlay.vue'
import { clientToDoc } from '@/renderer/utils/clientToDoc'
import { useRuntime } from '@/renderer/store'

export const TextBoxTool = defineTool({
  name: 'textbox',
  icon: 'text',

  overlayComponent: CreateTextBoxOverlay,

  setup ({ editor, interaction, root, viewportWidth, viewportHeight }) {
    const runtime = useRuntime()

    let dragValid = false

    let docX0: number
    let docY0: number
    interaction.styleCursor(false).draggable({
      listeners: {
        start (e) {
          dragValid = false

          const p = clientToDoc({ editor, root, viewportWidth, viewportHeight }, e.client.x, e.client.y)
          docX0 = p.x
          docY0 = p.y
        },
        move (e) {
          // Set dragValid to true if distance was over 10px
          if (!dragValid && Math.sqrt((e.clientX0 - e.client.x) ** 2 + (e.clientY0 - e.client.y) ** 2) > 10) {
            dragValid = true
          }

          const doc = clientToDoc({ editor, root, viewportWidth, viewportHeight }, e.client.x, e.client.y)

          runtime.tabs[editor.value.id].toolData.rect = {
            x: Math.round(Math.min(doc.x, docX0)),
            y: Math.round(Math.min(doc.y, docY0)),
            width: Math.round(Math.abs(doc.x - docX0)),
            height: Math.round(Math.abs(doc.y - docY0))
          }
        },
        end (e) {
          if (dragValid) {
            const doc = clientToDoc({ editor, root, viewportWidth, viewportHeight }, e.client.x, e.client.y)
            const textBox = createTextNode(new Rect(
              Math.round(Math.min(doc.x, docX0)),
              Math.round(Math.min(doc.y, docY0)),
              Math.round(Math.abs(doc.x - docX0)),
              Math.round(Math.abs(doc.y - docY0))
            ))

            editor.value.state
              .document
              .slides[(editor.value.state as EditorState).activeSlide]
              .children.push(textBox)

            editor.value.state.selection.selection = [textBox.id]
            editor.value.state.selection.editing = textBox.id
          }

          runtime.tabs[editor.value.id].toolData.rect = null
          editor.value.state.activeTool = 'selection'
        }
      }
    }).on('tap', (e) => {
      console.log(e)

      const doc = clientToDoc({ editor, root, viewportWidth, viewportHeight }, e.pageX, e.pageY)
      const textBox = createTextNode(new Rect(
        Math.round(doc.x),
        Math.round(doc.y)
      ))

      editor.value.state.selection.selection = [textBox.id]
      editor.value.state.selection.editing = textBox.id

      editor.value.state
        .document
        .slides[(editor.value.state as EditorState).activeSlide]
        .children.push(textBox)

      runtime.tabs[editor.value.id].toolData.rect = null
      editor.value.state.activeTool = 'selection'
    })
  }
})
