<template>
  <svg
    v-if="node"

    xmlns="http://www.w3.org/2000/svg"

    :x="node.rect?.x"
    :y="node.rect?.y"
    :width="(node.rect?.width ?? 1280) * scale"
    :height="(node.rect?.height ?? 720) * scale"

    :viewBox="`0 0 ${node.rect?.width} ${node.rect?.height}`"
  >
    <!-- Frame Background Rect -->
    <SvgElement
      :_id="node.id"
      :tag="'rect'"
      :defs="{
        fill: node.fill ?? 'transparent'
      }"
      x="0"
      y="0"
      :width="node.rect?.width"
      :height="node.rect?.height"
    />

    <!-- Frame Child Nodes -->
    <NodeDisplay
      v-for="child in node.children"
      :key="child.id"
      :node="child"
    />
  </svg>
</template>

<script>
import SvgElement from './svgElement/SvgElement.vue'

export default {
  components: {
    SvgElement
  },
  props: {
    node: Object,
    scale: { type: Number, default: () => 1 }
  },
  methods: {
    getShapeSvg () {
      return {
        tag: 'rect',
        width: this.node?.rect?.width,
        height: this.node?.rect?.height
      }
    },
    getBoundingBox () {
      return this.node?.rect
    }
  }
}
</script>
