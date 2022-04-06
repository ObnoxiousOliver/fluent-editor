<template>
  <div class="textbox">
    <div
      v-if="runtime.tabs[editor.id].toolData.rect"
      class="textbox-rect"
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
import { useRuntime } from '@/renderer/store'
import { computed, defineComponent } from 'vue'

export default defineComponent({
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

.textbox-rect {
  position: absolute;

  // background: rgba(r.$col-selection, 0.1);
  border: r.$col-primary dashed 2px;
  pointer-events: none;
}
</style>
