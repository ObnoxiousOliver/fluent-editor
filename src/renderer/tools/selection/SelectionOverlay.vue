<template>
  <div
    v-if="editor.state.activeTool === 'selection'"
    class="canvas-layers__selections"
  >
    <EditingBox
      v-if="editor.state.selection.editing"
      :key="editor.state.selection.editing"
      :elementId="editor.state.selection.editing"
      :scale="editor.state.canvas.scale"
      :editor="editor"
    />
    <div v-else>
      <HoverBox
        v-if="runtime.currentTab?.hovering[0] && !editor.state.selection.selection.includes(runtime.currentTab.hovering[0])"
        :key="runtime.currentTab?.hovering[0]"
        :elementId="runtime.currentTab?.hovering[0]"
        :scale="editor.state.canvas.scale"
        :editor="editor"
      />
      <SelectionBox
        v-for="element in editor.state.selection.selection"
        :key="element"
        :elementId="element"
        :scale="editor.state.canvas.scale"
        :posX="editor.state.canvas.posX"
        :posY="editor.state.canvas.posY"
        :editor="editor"
      />
    </div>
  </div>
</template>

<script lang="ts">
import EditingBox from '@/renderer/components/editor/EditingBox.vue'
import HoverBox from '@/renderer/components/editor/HoverBox.vue'
import SelectionBox from '@/renderer/components/editor/SelectionBox.vue'
import { useRuntime } from '@/renderer/store'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    EditingBox,
    HoverBox,
    SelectionBox
  },
  props: {
    editor: Object,
    box: Object
  },

  setup () {
    const runtime = useRuntime()

    return {
      runtime
    }
  }
})
</script>
