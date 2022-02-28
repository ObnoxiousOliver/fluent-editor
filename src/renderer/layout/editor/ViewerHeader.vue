<template>
  <div class="viewer-header">
    <div class="viewer-header__start">
      <button @click="editor_.state.activeTool = 'selection'">Selection</button>
      <button @click="editor_.state.activeTool = 'textbox'">Textbox</button>
      {{ editor_.state.activeTool }}
    </div>
    <div class="viewer-header__end">
      end
    </div>
  </div>
</template>

<script lang="ts">
import EditorInstance from '@/renderer/models/editor/EditorInstance'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  props: {
    editor: Object
  },
  setup (props) {
    const editor_ = ref(props.editor as EditorInstance | null)

    return {
      editor_
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.viewer-header {
  display: flex;
  flex-flow: row;
  height: 40px;

  @include r.light {
    background: r.$col-white;
  }
  @include r.dark {
    background: r.$col-700;
  }

  &__start {
    flex: 1 1 auto;
  }
  &__end {
    flex: 0 0 auto;
  }
}
</style>
