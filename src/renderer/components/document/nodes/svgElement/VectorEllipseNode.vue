<template>
  <SvgElement
    :_id="node.id"
    :tag="'ellipse'"
    :cx="node.rect?.x + node.rect?.width / 2"
    :cy="node.rect?.y + node.rect?.height / 2"
    :rx="node.rect?.width / 2"
    :ry="node.rect?.height / 2"
    :defs="defs"
  />
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import SvgElement from './SvgElement.vue'

export default defineComponent({
  components: {
    SvgElement
  },
  props: {
    vectorData: Object,
    node: Object,
    defs: Object
  },
  methods: {
    getShapeSvg () {
      return {
        tag: 'ellipse',
        cx: this.node?.rect?.width / 2,
        cy: this.node?.rect?.height / 2,
        rx: this.node?.rect?.width / 2,
        ry: this.node?.rect?.height / 2
      }
    }
  }
})
</script>
