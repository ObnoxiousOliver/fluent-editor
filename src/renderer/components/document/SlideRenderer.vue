<template>
  <div
    class="slide-renderer"
    :style="{
      width: document.meta.size.width * scale + 'px',
      height: document.meta.size.height * scale + 'px'
    }"
  >
    <div
      class="slide-root"
      :style="{
        width: document.meta.size.width + 'px',
        height: document.meta.size.height + 'px',
        background: activeSlide_.fill,
        transform: `scale(${scale})`
      }"
    >
      <NodeDisplay
        v-for="node in activeSlide_.children"
        :key="node.id"
        :node="node"
        :scale="scale"
        :editor="editor"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import NodeDisplay from './nodes/NodeDisplay.vue'
import { defineComponent } from '@vue/runtime-core'
import { Slide } from '@/renderer/models/document/slide'
import { FluentDocument } from '@/renderer/models/document/FluentDocument'

export default defineComponent({
  name: 'SlideRenderer',
  components: {
    NodeDisplay
  },

  props: {
    document: Object,
    activeSlide: Number,
    scale: Number,
    editor: Object
  },

  setup (props) {
    const activeSlide_ = computed((): Slide | null =>
      (props.document as FluentDocument)?.slides[props.activeSlide ?? 0])

    return {
      activeSlide_
    }
  }
})
</script>

<style lang="scss" scoped>
.slide-root {
  transform-origin: 0 0;
}
</style>
