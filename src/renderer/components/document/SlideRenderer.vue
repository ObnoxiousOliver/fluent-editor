<template>
  <div class="slide-renderer">
    <NodeRenderer :node="rootElement" />
  </div>
</template>

<script lang="ts">
import { useEditor } from '@/renderer/store'
import { storeToRefs } from 'pinia'
import { computed } from '@vue/reactivity'
import NodeRenderer from './nodes/NodeRenderer.vue'
import Rect from '@/renderer/models/nodes/Rect'

export default {
  name: 'SlideRenderer',
  components: {
    NodeRenderer
  },

  setup () {
    const editorStore = useEditor()
    const { document } = storeToRefs(editorStore)

    const activeSlide = computed(() => document.value.slides[editorStore.slideIndex])

    const rootElement = computed(() => ({
      ...activeSlide.value.root,
      rect: new Rect(0, 0, document.value.meta.size.width, document.value.meta.size.height),
      fill: activeSlide.value.background
    }))

    return {
      editorStore,
      document,
      activeSlide,
      rootElement
    }
  }
}
</script>
