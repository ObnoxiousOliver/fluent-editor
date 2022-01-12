<template>
  <svg
    v-if="node"

    xmlns="http://www.w3.org/2000/svg"

    :x="node.rect?.x"
    :y="node.rect?.y"
    :width="node.rect?.width"
    :height="node.rect?.height"

    :viewbox="`0 0 ${node.rect?.width} ${node.rect?.height}`"
  >
    <!-- Frame Background Rect -->
    <SvgElement
      :id="node.id"
      :tag="'rect'"
      :fill="node.fill ?? 'transparent'"
      x="0"
      y="0"
      :width="node.rect?.width"
      :height="node.rect?.height"
    />

    <!-- Frame Child Nodes -->
    <NodeRenderer
      v-for="child in node.children"
      :key="child.id"
      :node="child"
    />
  </svg>
</template>

<script>
import NodeRenderer from './NodeRenderer.vue'
import SvgElement from './SvgElement.vue'

export default {
  name: 'NodeRenderer',
  components: {
    NodeRenderer,
    SvgElement
  },
  props: {
    node: Object
  }
}
</script>
