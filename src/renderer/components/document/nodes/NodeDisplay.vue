<template>
  <component
    :is="node?.type"
    :node="node"
    @mouseenter="mouseenter"
    @mouseleave="mouseleave"
  />
</template>

<script lang="ts">
import NodeTypes from '@/renderer/models/nodes/NodeTypes'
import { useEditor } from '@/renderer/store'
import { computed, defineComponent } from '@vue/runtime-core'
import FrameNode from './FrameNode.vue'
import VectorNode from './VectorNode.vue'

export default defineComponent({
  components: {
    [NodeTypes.Frame]: FrameNode,
    [NodeTypes.Vector]: VectorNode
  },
  props: {
    node: Object,
    isRoot: Boolean
  },

  setup (props) {
    const editor = useEditor()

    const hovering = computed(() => editor.currentEditor.state.selection.hovering[
      editor.currentEditor.state.selection.hovering.length - 1
    ] === props.node?.id)

    function mouseenter () {
      if (props.isRoot) return
      editor.currentEditor.state.selection.hovering.push(props.node?.id)
    }
    function mouseleave () {
      if (props.isRoot) return
      editor.currentEditor.state.selection.hovering =
        editor.currentEditor.state.selection.hovering.filter(x => x !== props.node?.id)
    }
    return {
      editor,
      hovering,
      mouseenter,
      mouseleave
    }
  }
})
</script>
