<template>
  <div
    class="text-node"
    ref="root"
    :style="{
      ...getTextNodeStyleObject(),
      opacity: editor.state.selection.editing === node.id ? 0 : 1
    }"
    v-html="output"
  />
</template>

<script lang="ts">
import { getTextNodeStyleObject } from '@/renderer/utils/defaultToStyle'
import Rect from '@/renderer/models/nodes/Rect'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import FluentTiptapKit from '../../editor/textEditor/tiptap/fluent-tiptap-kit'
import { generateHTML } from '@tiptap/core'

export default defineComponent({
  props: {
    node: Object,
    scale: Number,
    editor: Object
  },
  setup (props) {
    const root = ref()

    watch(() => [
      props.editor,
      props.node
    ], () => updateBoundingBox(), { deep: true })
    onMounted(() => {
      updateBoundingBox()

      const observer = new ResizeObserver(() => updateBoundingBox())
      observer.observe(root.value!)

      onBeforeUnmount(() => {
        observer.unobserve(root.value!)
      })
    })

    function updateBoundingBox () {
      var rect = new Rect(
      props.node?.rect.x,
      props.node?.rect.y,
      (props.node?.rect.width ?? (root.value as HTMLElement).getBoundingClientRect().width / (props.scale ?? 1)),
      (props.node?.rect.height ?? (root.value as HTMLElement).getBoundingClientRect().height / (props.scale ?? 1)))
      boundingBox.value = rect
    }

    const boundingBox = ref()

    const output = computed(() => {
      if (!props.node?.value.content) return ''

      try {
        var content = generateHTML(props.node?.value.content, [FluentTiptapKit])

        var doc = new DOMParser().parseFromString(content, 'text/html')

        doc.querySelectorAll('p').forEach(item => {
          // if (!item.textContent) {
          item.innerHTML += '<br class="trailing-break">'
          // console.log(!item.textContent, item.innerHTML)
          // }
        })

        return doc.body.innerHTML
      } catch {
        return ''
      }
    })

    return {
      root,
      getTextNodeStyleObject,
      generateHTML,
      boundingBox,
      output
    }
  }
})
</script>

<style lang="scss" scoped>
.text-node {
  padding: 5px;

  word-wrap: break-word;
  white-space: break-spaces;
  font-variant-ligatures: normal;
  font-feature-settings: unset;

  :deep(p:not(:last-child)) {
    margin-block-end: var(--paragraph-spacing);
  }
}
</style>
