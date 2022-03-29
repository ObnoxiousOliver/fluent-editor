import { defineTool } from '@/renderer/models/editor/tools/Tool'
import Rect from '@/renderer/models/nodes/Rect'
import { useRuntime } from '@/renderer/store'
import getElementPath from '@/renderer/utils/getElementPath'

import SelectionOverlay from './SelectionOverlay.vue'

export const SelectionTool = defineTool({
  name: 'selection',
  overlayComponent: SelectionOverlay,
  deactivated (editor) {
    editor.state.selection.editing = null
  },
  setup ({ interaction, editor, root, viewportWidth, viewportHeight }) {
    // console.log(interaction)
    const runtime = useRuntime()

    function elementsInBox (): string[] {
      if (!runtime.tabs[editor.value.id]) return []

      const boxRect = runtime.tabs[editor.value.id].toolData.rect

      const x = boxRect.x
      const y = boxRect.y
      const width = boxRect.width
      const height = boxRect.height

      const elements = Object.values(runtime.tabs[editor.value.id]?.registeredElements)

      const inBox = elements.filter(el => boxesAreOverlapping(el.boundingBox, {
        x,
        y,
        width,
        height
      })).map(x => x.id)

      return inBox
    }

    function boxesAreOverlapping (box1: Rect, box2: Rect) {
      return boxesAreOverlapping1D(
        { p: box1.x, length: box1.width ?? 0 },
        { p: box2.x, length: box2.width ?? 0 }) &&
        boxesAreOverlapping1D(
          { p: box1.y, length: box1.height ?? 0 },
          { p: box2.y, length: box2.height ?? 0 })
    }

    function boxesAreOverlapping1D (
      box1: { p: number, length: number },
      box2: { p: number, length: number }) {
      return box1.p + box1.length >= box2.p && box2.p + box2.length >= box1.p
    }

    function clientToDoc (x: number, y: number): { x: number, y: number } {
      const { scale, posX, posY } = editor.value.state.canvas

      const docX = posX - (editor.value.state.document.meta.size.width ?? 0) * scale * 0.5
      const docY = posY - (editor.value.state.document.meta.size.height ?? 0) * scale * 0.5

      const rootRect = root.value!.getBoundingClientRect()

      return {
        x: (x - rootRect.x - docX) / scale - viewportWidth.value * 0.5 / scale,
        y: (y - rootRect.y - docY) / scale - viewportHeight.value * 0.5 / scale
      }
    }

    let dragValid = false

    let docX0: number
    let docY0: number

    interaction.styleCursor(false).draggable({
      inertia: false,
      manualStart: true,
      listeners: {
        start (e) {
          dragValid = false

          const p = clientToDoc(e.client.x, e.client.y)
          docX0 = p.x
          docY0 = p.y
        },
        move (e) {
          // console.log(e)

          // Set dragValid to true if distance was over 10px
          if (!dragValid && Math.sqrt((e.clientX0 - e.client.x) ** 2 + (e.clientY0 - e.client.y) ** 2) > 10) {
            dragValid = true
          }

          const doc = clientToDoc(e.client.x, e.client.y)

          const { scale } = editor.value.state.canvas

          runtime.tabs[editor.value.id].toolData.rect = {
            x: Math.min(doc.x, docX0),
            y: Math.min(doc.y, docY0),
            width: Math.abs(doc.x - docX0),
            height: Math.abs(doc.y - docY0)
          }

          // Set Elements in Box to hover
          runtime.tabs[editor.value.id].hovering = elementsInBox()
        },
        end () {
          if (dragValid) {
            // Set Elements in Box to selected
            editor.value.state.selection.selection = elementsInBox()
          }

          dragValid = false
          runtime.tabs[editor.value.id].toolData.rect = null
        }
      }
    }).on('down', (e: any) => {
      if (e.pointerType !== 'mouse') return
      if (![1, 2].includes(e.buttons)) return
      if (editor.value.state.selection.editing) return
      if (getElementPath(e.target).find(x => x.classList?.contains('selection-box'))) return

      const i = e.interaction

      if (!i.interacting()) {
        i.start(
          { name: 'drag' },
          e.interactable,
          e.currentTarget
        )
      }
    })
  }
})
