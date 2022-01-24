<template>
  <NodeDisplay
    class="slide-root"
    :node="rootElement"
    :isRoot="true"
  />
</template>

<script lang="ts">
import { computed } from '@vue/reactivity'
import NodeDisplay from './nodes/NodeDisplay.vue'
import Rect from '@/renderer/models/nodes/Rect'
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
    activeSlide: Number
  },

  setup (props) {
    const activeSlide_ = computed((): Slide | null =>
      (props.document as FluentDocument)?.slides[props.activeSlide ?? 0])

    const rootElement = computed(() => ({
      ...activeSlide_.value?.root,
      rect: new Rect(0, 0,
        props.document?.meta.size.width,
        props.document?.meta.size.height),
      fill: activeSlide_.value?.background
    }))

    return {
      activeSlide_,
      rootElement
    }
  }
})
</script>
