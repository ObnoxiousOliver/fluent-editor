<template>
  <div
    class="editing-box"
    :style="{
      top: element?.boundingBox.y * scale + 'px',
      left: element?.boundingBox.x * scale + 'px',
      width: element?.boundingBox.width * scale + 'px',
      height: element?.boundingBox.height * scale + 'px'
    }"
  >
    <component
      :is="elementEditor"
      :element="element"
      :scale="scale"
      :editor="editor"
    />
  </div>
</template>

<script lang="ts">
import NodeTypes from '@/renderer/models/nodes/NodeTypes'
import { useRuntime } from '@/renderer/store'
import { computed, defineComponent } from 'vue'
import TextEditor from './textEditor/TextEditor.vue'

export default defineComponent({
  components: {
    TextEditor
  },
  props: {
    elementId: String,
    scale: Number,
    editor: Object
  },

  setup (props) {
    const runtime = useRuntime()

    const element = computed(() => runtime.tabs[props.editor?.id]?.registeredElements[props.elementId!])

    const elementEditor = computed(() => {
      return ({
        [NodeTypes.Text]: TextEditor
      } as any)[element.value?.node.type ?? -1]
    })

    return {
      element,
      elementEditor
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.editing-box {
  position: absolute;
}
</style>
