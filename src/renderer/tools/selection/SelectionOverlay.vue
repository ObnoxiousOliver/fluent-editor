<template>
  <div class="selection">
    <EditingBox
      v-if="editor.state.selection.editing"
      :key="editor.state.selection.editing"
      :elementId="editor.state.selection.editing"
      :scale="editor.state.canvas.scale"
      :editor="editor"
    />
    <div v-else>
      <HoverBox
        v-if="runtime.tabs[editor.id]?.hovering[0] &&
          !editor.state.selection.selection.includes(runtime.tabs[editor.id].hovering[0])"
        :key="runtime.tabs[editor.id]?.hovering[0]"
        :elementId="runtime.tabs[editor.id]?.hovering[0]"
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

    <teleport
      v-if="overlay"
      :to="overlay"
    >
      <div
        v-if="runtime.tabs[editor.id].toolData.rect"
        class="box-selection"
        :style="{
          top: top + 'px',
          left: left + 'px',
          width: runtime.tabs[editor.id].toolData.rect?.width + 'px',
          height: runtime.tabs[editor.id].toolData.rect?.height + 'px'
        }"
      />
    </teleport>
  </div>
</template>

<script lang="ts">
import EditingBox from '@/renderer/components/editor/EditingBox.vue'
import HoverBox from '@/renderer/components/editor/HoverBox.vue'
import SelectionBox from '@/renderer/components/editor/SelectionBox.vue'
import { useRuntime } from '@/renderer/store'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  components: {
    EditingBox,
    HoverBox,
    SelectionBox
  },
  props: {
    editor: Object,
    canvas: Object,
    overlay: Object
  },

  setup (props) {
    const runtime = useRuntime()

    const top = computed(() => {
      if (!runtime.tabs[props.editor!.id].toolData.rect) return null

      const rect: DOMRect = props.canvas?.getBoundingClientRect()

      return runtime.tabs[props.editor!.id].toolData.rect?.y - rect.y /* - props.editor!.state.canvas.posY - (rect.height - props.editor!.state.canvas.scale * props.editor!.state.document.meta.size.height) / 2 */
    })
    const left = computed(() => {
      if (!runtime.tabs[props.editor!.id].toolData.rect) return null

      const rect: DOMRect = props.canvas?.getBoundingClientRect()

      return runtime.tabs[props.editor!.id].toolData.rect?.x - rect.x /* - props.editor!.state.canvas.posX - (rect.width - props.editor!.state.canvas.scale * props.editor!.state.document.meta.size.width) / 2 */
    })

    return {
      runtime,
      top,
      left
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.box-selection {
  position: absolute;

  background: rgba(r.$col-selection, 0.1);
  border: r.$col-selection solid 1px;
  pointer-events: none;
}
</style>
