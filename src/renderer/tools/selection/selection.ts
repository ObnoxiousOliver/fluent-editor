import { defineTool } from '@/renderer/models/editor/tools/Tool'
import { useRuntime } from '@/renderer/store'
import { e } from 'mathjs'

import SelectionOverlay from './SelectionOverlay.vue'

export const SelectionTool = defineTool({
  name: 'selection',
  overlayComponent: SelectionOverlay,
  deactivated (editor) {
    editor.state.selection.editing = null
  },
  interact (interaction, editor) {
    // console.log(interaction)

    interaction.styleCursor(false).draggable({
      inertia: false,
      listeners: {
        move (e) {
          useRuntime().tabs[editor.id].toolData.rect = {
            x: Math.min(e.client.x, e.clientX0),
            y: Math.min(e.client.y, e.clientY0),
            width: Math.abs(e.client.x - e.clientX0),
            height: Math.abs(e.client.y - e.clientY0)
          }
        },
        end () {
          useRuntime().tabs[editor.id].toolData.rect = null
        }
      }
    })
  }
})
