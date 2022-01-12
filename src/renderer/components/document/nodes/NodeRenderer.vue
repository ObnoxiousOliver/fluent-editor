<template>
  <component
    :is="node?.type"
    :node="node"
  />
</template>

<script>
import NodeTypes from '@/renderer/models/nodes/NodeTypes'
import FrameNode from './FrameNode.vue'

export default {
  name: 'NodeRenderer',
  components: {
    [NodeTypes.Frame]: FrameNode
  },

  props: {
    node: Object
  }
}
</script>
