<template>
  <SvgElement
    :_id="node.id"
    :tag="'path'"
    :defs="defs"
    :d="pathData"
  />
</template>

<script lang="ts">
import VectorStar from '@/renderer/models/nodes/svg/VectorStar'
import { computed, defineComponent } from '@vue/runtime-core'
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

  setup (props) {
    const pathData = computed(() => {
      var segments = Math.max(3, (props.vectorData as VectorStar)?.s ?? 5) * 2
      var ratio = Math.max(0, (props.vectorData as VectorStar)?.r ?? 0.8)

      // a * sin(b(x - c))

      var cx = props.node?.rect?.x + props.node?.rect?.width / 2
      var cy = props.node?.rect?.y + props.node?.rect?.height / 2
      var rx = props.node?.rect?.width / 2
      var ry = props.node?.rect?.height / 2

      return Array(segments).fill(null).map((_, i) => ({
        x: (i % 2 ? 1 : ratio) * rx * Math.cos(2 * Math.PI / segments * (i + 1) - 0.5 * Math.PI) + cx,
        y: (i % 2 ? 1 : ratio) * ry * Math.sin(2 * Math.PI / segments * (i + 1) - 0.5 * Math.PI) + cy
      })).map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join('') + 'Z'
    })

    return {
      pathData
    }
  }
})
</script>
