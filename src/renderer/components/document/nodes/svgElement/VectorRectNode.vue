<template>
  <SvgElement
    :_id="node.id"
    :tag="'rect'"
    :x="node.rect?.x"
    :y="node.rect?.y"
    :width="node.rect?.width"
    :height="node.rect?.height"
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
  }
})
</script>
