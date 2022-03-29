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

    <div
      v-if="runtime.tabs[editor.id].toolData.rect"
      class="box-selection"
      :style="{
        top: top * editor.state.canvas.scale + 'px',
        left: left * editor.state.canvas.scale + 'px',
        width: runtime.tabs[editor.id].toolData.rect?.width * editor.state.canvas.scale + 'px',
        height: runtime.tabs[editor.id].toolData.rect?.height * editor.state.canvas.scale + 'px'
      }"
    />
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

      return runtime.tabs[props.editor!.id].toolData.rect?.y
    })
    const left = computed(() => {
      if (!runtime.tabs[props.editor!.id].toolData.rect) return null

      return runtime.tabs[props.editor!.id].toolData.rect?.x
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
