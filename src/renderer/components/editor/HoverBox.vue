<template>
  <div
    class="hover-box"
    :style="{
      top: element?.boundingBox.y * scale + 'px',
      left: element?.boundingBox.x * scale + 'px',
      width: element?.boundingBox.width * scale + 'px',
      height: element?.boundingBox.height * scale + 'px'
    }"
  />
</template>

<script lang="ts">
import { useRuntime } from '@/renderer/store'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    elementId: String,
    scale: Number,
    editor: Object
  },

  setup (props) {
    const runtime = useRuntime()

    const element = computed(() => runtime.tabs[props.editor?.id ?? '']?.registeredElements[props.elementId!])

    return {
      element
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.hover-box {
  position: absolute;

  outline: rgba(r.$col-selection, .3) solid 2px;
  outline-offset: -1px;
}
</style>
