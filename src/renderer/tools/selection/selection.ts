import { defineTool } from '@/renderer/models/editor/tools/Tool'
import { useRuntime } from '@/renderer/store'

import SelectionOverlay from './SelectionOverlay.vue'

export const SelectionTool = defineTool({
  name: 'selection',
  overlayComponent: SelectionOverlay,
  interact (interaction, editor) {
    console.log(interaction)

    interaction.styleCursor(false).draggable({
      inertia: false,
      listeners: {
        move (e) {
          console.log(e)
          useRuntime().tabs[editor.id].toolData.rect = e.rect
        }
      }
    })
  }
})
