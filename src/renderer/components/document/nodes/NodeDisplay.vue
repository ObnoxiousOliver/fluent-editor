<template>
  <component
    ref="root"
    class="node"
    :is="node?.type"
    :node="node"
    :style="{
      top: node?.rect.y + 'px',
      left: node?.rect.x + 'px',
      width: node?.rect.width + 'px',
      height: node?.rect.height + 'px'
    }"
    :scale="scale"
    :editor="editor"
  />
  <!-- @mouseover="mouseenter"
    @mouseout="mouseleave" -->
</template>

<script lang="ts">
import TextNode from './TextNode.vue'
import NodeTypes from '@/renderer/models/nodes/NodeTypes'
import { useRuntime } from '@/renderer/store'
import { defineComponent, onMounted, ref, watch } from '@vue/runtime-core'
import Node from '@/renderer/models/nodes/Node'

export default defineComponent({
  components: {
    [NodeTypes.Text]: TextNode
  },
  props: {
    node: Object,
    scale: Number,
    editor: Object
  },

  setup (props) {
    const root = ref(null as any)

    const runtime = useRuntime()

    watch(() => [
      props.editor,
      root.value?.boundingBox,
      root.value?.setBoundingBox
    ], () => updateRegisteredElement(), { deep: true })

    onMounted(() => {
      updateRegisteredElement()
    })

    function updateRegisteredElement () {
      if (!props.editor) return

      if (!runtime.tabs[props.editor.id]) {
        runtime.tabs[props.editor.id] = {
          hovering: [],
          registeredElements: {}
        }
      }

      if (!props.node) return

      const node = props.node as Node
      const boundingBox = root.value?.boundingBox ?? props.node?.rect

      const setBoundingBox = root.value?.setBoundingBox ?? ((changes: {
        x?: number,
        y?: number,
        width?: number | null,
        height?: number | null}) => {
        if (changes.x !== undefined) props.node!.rect.x = changes.x
        if (changes.y !== undefined) props.node!.rect.y = changes.y
        if (changes.width !== undefined) props.node!.rect.width = changes.width
        if (changes.height !== undefined) props.node!.rect.height = changes.height
      })

      runtime.tabs[props.editor.id].registeredElements[props.node.id] = {
        id: node.id,
        node,
        boundingBox,
        setBoundingBox,
        snappingPoints: [
          {
            x: boundingBox.x,
            y: boundingBox.y
          },
          {
            x: boundingBox.x,
            y: boundingBox.y + boundingBox.height
          },
          {
            x: boundingBox.x + boundingBox.width,
            y: boundingBox.y
          },
          {
            x: boundingBox.x + boundingBox.width,
            y: boundingBox.y + boundingBox.height
          },
          {
            x: boundingBox.x + Math.round(boundingBox.width * 0.5),
            y: boundingBox.y + Math.round(boundingBox.height * 0.5)
          }
        ]
      }
    }

    // runtime.registerElement(props.node?.id, (): RegistedElement => {
    //   const boundingBox = root.value?.boundingBox ?? props.node?.rect

    //   const setBoundingBox = root.value?.setBoundingBox ?? ((changes: {
    //     x?: number,
    //     y?: number,
    //     width?: number | null,
    //     height?: number | null}) => {
    //     if (changes.x !== undefined) props.node!.rect.x = changes.x
    //     if (changes.y !== undefined) props.node!.rect.y = changes.y
    //     if (changes.width !== undefined) props.node!.rect.width = changes.width
    //     if (changes.height !== undefined) props.node!.rect.height = changes.height
    //   })

    //   return {
    //     id: props.node?.id,
    //     order: runtime.getOrder(props.node?.id),
    //     node: props.node as Node,
    //     boundingBox,
    //     setBoundingBox,
    //     snappingPoints: [
    //       {
    //         x: boundingBox.x,
    //         y: boundingBox.y
    //       },
    //       {
    //         x: boundingBox.x,
    //         y: boundingBox.y + boundingBox.height
    //       },
    //       {
    //         x: boundingBox.x + boundingBox.width,
    //         y: boundingBox.y
    //       },
    //       {
    //         x: boundingBox.x + boundingBox.width,
    //         y: boundingBox.y + boundingBox.height
    //       },
    //       {
    //         x: boundingBox.x + Math.round(boundingBox.width * 0.5),
    //         y: boundingBox.y + Math.round(boundingBox.height * 0.5)
    //       },
    //       ...(root.value?.getSnappingPoints?.() ?? [])
    //     ]
    //   }
    // })

    return {
      root
    }
  }
})
</script>

<style lang="scss" scoped>
.node {
  position: absolute;
  pointer-events: none;
}
</style>
