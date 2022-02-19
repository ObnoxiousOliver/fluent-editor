<template>
  <component
    ref="root"
    :is="'vector_' + node?.vectorType"
    :vectorData="node?.vectorData"
    :node="node"
    :defs="{
      fill: node?.fill ?? 'none',
    }"
    v-bind="$attrs"
  />
  <g v-if="node?.stroke">
    <mask
      v-if="node?.stroke?.location !== 'center'"
      :id="`${node.id}_clip_stroke`"
    >
      <rect
        v-if="node?.stroke?.location === 'outside'"
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="white"
      />
      <NodeDisplay
        :node="{ ...node, stroke: null }"
        :filter="`contrast(0)brightness(${node?.stroke?.location === 'outside' ? 0 : 2})`"
      />
    </mask>
    <component
      :is="'vector_' + node?.vectorType"
      :vectorData="node?.vectorData"
      :node="node"
      :defs="{
        stroke: node?.stroke?.fill,
        fill: 'none'
      }"
      :stroke-width="node?.stroke?.width * (node?.stroke?.location !== 'center' ? 2 : 1)"
      :stroke-linecap="node?.stroke?.lineCap"
      :stroke-linejoin="node?.stroke?.lineJoin"
      :stroke-dasharray="node?.stroke?.dashArray?.join(' ')"
      :stroke-dashoffset="node?.stroke?.dashOffset"
      :mask="node?.stroke?.location !== 'center' ? `url(#${node.id}_clip_stroke)` : null"
    />
  </g>
</template>

<script lang="ts">
import VectorPathNode from './svgElement/VectorPathNode.vue'
import VectorRectNode from './svgElement/VectorRectNode.vue'
import VectorEllipseNode from './svgElement/VectorEllipseNode.vue'
import VectorPolygonNode from './svgElement/VectorPolygonNode.vue'
import VectorStarNode from './svgElement/VectorStarNode.vue'
// import { computed } from '@vue/reactivity'
// import Vector from '@/renderer/models/nodes/Vector'
import { defineComponent } from '@vue/runtime-core'
import SvgElement from './svgElement/SvgElement.vue'
// import Stroke from '@/renderer/models/vector/Stroke'

export default defineComponent({
  components: {
    vector_path: VectorPathNode,
    vector_rect: VectorRectNode,
    vector_ellipse: VectorEllipseNode,
    vector_polygon: VectorPolygonNode,
    vector_star: VectorStarNode,
    SvgElement
  },
  props: {
    node: Object
  },
  methods: {
    getShapeSvg () {
      return (this.$refs.root as any)?.getShapeSvg?.()
    },
    getBoundingBox () {
      return this.node?.rect
    }
  }
})
</script>
