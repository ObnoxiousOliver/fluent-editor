
<template>
  <div class="text-editor dont-interact">
    <FloatingMenu class="text-editor__floating-menu" />
    <div
      class="text-editor__tip-tap"
      :style="{
        ...getTextNodeStyleObject(),
        height: element_.boundingBox.height + 'px',
        width: element_.boundingBox.width + 'px',
        transform: `scale(${scale})`
      }"
      @keydown.esc="escape"
    >
      <TiptapEditor v-model:json="json" />
    </div>
  </div>
</template>

<script lang="ts">
import EditorInstance from '@/renderer/models/editor/EditorInstance'
import { getTextNodeStyleObject } from '@/renderer/utils/defaultToStyle'
import { computed, defineComponent, ref, watch } from 'vue'
import FloatingMenu from './FloatingMenu.vue'
import TiptapEditor from './tiptap/TiptapEditor.vue'

export default defineComponent({
  components: {
    FloatingMenu,
    TiptapEditor
  },

  props: {
    element: Object,
    scale: Number,
    editor: Object
  },

  setup (props) {
    const editor_ = ref(props.editor as EditorInstance | null)

    const element_ = ref(props.element)
    watch(() => props.element, () => { element_.value = props.element })

    const json = computed({
      get () {
        return element_.value?.node.value.content
      },
      set (val) {
        if (!element_.value) return
        element_.value.node.value.content = val
      }
    })

    function escape () {
      if (!editor_.value) return

      editor_.value.state.selection.editing = null
    }

    return {
      editor_,
      element_,
      json,
      getTextNodeStyleObject,
      escape
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../../scss' as r;

.text-editor {
  position: absolute;
  inset: 0;
  outline: r.$col-selection solid 2px;
  outline-offset: -1px;

  &__tip-tap {
    padding: 5px;
    width: fit-content;
    height: fit-content;

    caret-color: currentColor;
    transform-origin: 0 0;

    pointer-events: all;

    & > div {
      height: 100%;
    }

    :deep(.ProseMirror) {
      height: 100%;
      font-variant-ligatures: normal;
      font-feature-settings: unset;

      &:focus {
        outline: none;
      }
    }

    :deep(p:not(:last-child)) {
      margin-block-end: var(--paragraph-spacing);
    }
  }
}
</style>
