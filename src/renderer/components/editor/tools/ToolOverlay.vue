<template>
  <component
    v-if="tool?.overlayComponent"
    :editor="editor_"
    :is="tool.overlayComponent"
  />
</template>

<script lang="ts">
import EditorInstance from '@/renderer/models/editor/EditorInstance'
import { computed, defineComponent, ref } from 'vue'
import ToolExtention, { tools } from '@/renderer/models/editor/tools/Tool'

export default defineComponent({
  props: {
    editor: Object
  },

  setup (props) {
    const editor_ = ref(props.editor as EditorInstance | null)

    const activeTool = computed(() => editor_.value?.state.activeTool)
    const tool = computed(() => tools[activeTool.value ?? ''] as ToolExtention | undefined)

    return {
      editor_,
      activeTool,
      tool
    }
  }
})
</script>
