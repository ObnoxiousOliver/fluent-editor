<template>
  <SvgElement
    :_id="node.id"
    :tag="'path'"
    :defs="defs"
    :d="pathData"
  />
</template>

<script lang="ts">
import VectorPath from '@/renderer/models/nodes/svg/VectorPath'
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
      var d = (props.vectorData as VectorPath)?.d
      var rect = props.node?.rect

      var maxY = Math.max(...d.map(x => x.p?.filter((_, i) => i % 2)).reduce((a, b) => [...(a ?? []), ...(b ?? [])]))
      var maxX = Math.max(...d.map(x => x.p?.filter((_, i) => !(i % 2))).reduce((a, b) => [...(a ?? []), ...(b ?? [])]))

      return d.map(x => [
        x.t,
        ...(x.p ?? [])
          .map((p, i) => (i % 2
            ? p * (rect?.height / maxY) + rect?.y
            : p * (rect?.width / maxX) + rect?.x))
      ].join(' ')).join(' ')
    })

    return {
      pathData
    }
  }
})
</script>
