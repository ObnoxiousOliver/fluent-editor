import { defineTool } from '@/renderer/models/editor/tools/Tool'
import { useRuntime } from '@/renderer/store'
import getElementPath from '@/renderer/utils/getElementPath'
import { e } from 'mathjs'

import SelectionOverlay from './SelectionOverlay.vue'

export const SelectionTool = defineTool({
  name: 'selection',
  overlayComponent: SelectionOverlay,
  deactivated (editor) {
    editor.state.selection.editing = null
  },
  setup ({ interaction, editor }) {
    // console.log(interaction)

    function elementsInBox (): string[] {
      return []
    }

    let dragValid = false
    interaction.styleCursor(false).draggable({
      inertia: false,
      manualStart: true,
      listeners: {
        start () {
          dragValid = false
        },
        move (e) {
          // console.log(e)

          // Set dragValid to true if distance was over 10px
          if (!dragValid && Math.sqrt((e.clientX0 - e.client.x) ** 2 + (e.clientY0 - e.client.y) ** 2) > 10) {
            dragValid = true
          }

          useRuntime().tabs[editor.id].toolData.rect = {
            x: Math.min(e.client.x, e.clientX0),
            y: Math.min(e.client.y, e.clientY0),
            width: Math.abs(e.client.x - e.clientX0),
            height: Math.abs(e.client.y - e.clientY0)
          }

          // Set Elements in Box to hover
          useRuntime().tabs[editor.id].hovering = elementsInBox()
        },
        end () {
          if (dragValid) {
            // Set Elements in Box to selected
            editor.state.selection.selection = elementsInBox()
          }

          dragValid = false
          useRuntime().tabs[editor.id].toolData.rect = null
        }
      }
    }).on('down', (e: any) => {
      if (e.pointerType !== 'mouse') return
      if (![1, 2].includes(e.buttons)) return
      if (editor.state.selection.editing) return
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
