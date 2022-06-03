<template>
  <div class="editor">
    <div :class="$bem('editor__panel', 'hierachie')">
      <HierachiePanel v-model:editor="editor" />
    </div>
    <div :class="$bem('editor__panel', 'viewer')">
      <ViewerPanel v-model:editor="editor" />
    </div>
    <div :class="$bem('editor__panel', 'properties')">
      <PropertiesPanel v-model:editor="editor" />
    </div>
    <div
      v-if="editor?.state?.mode === 'animate'"
      :class="$bem('editor__panel', 'timeline')"
    >
      Timeline
    </div>
  </div>
</template>

<script lang="ts">
import { createEditorState } from '@/renderer/models/editor/EditorState'
import { computed, defineComponent, ref, watch } from 'vue'
import { useEditor, useRuntime } from '../../store'

import HierachiePanel from './HierachiePanel.vue'
import PropertiesPanel from './PropertiesPanel.vue'
import ViewerPanel from './ViewerPanel.vue'

export default defineComponent({
  components: {
    HierachiePanel,
    ViewerPanel,
    PropertiesPanel
  },

  props: {
    id: { type: String, required: true },
    project: Object
  },

  setup (props, { emit }) {
    const editorStore = useEditor()
    const runtime = useRuntime()

    const editor = computed(() => editorStore.tabs.find(tab => tab.id === props.id))

    runtime.addTab(props.id)

    const project_ = ref(props.project)
    watch(project_, () => {
      emit('update:project', project_.value)
    })

    watch(editor, () => {
      if (!project_.value) return

      project_.value.document = JSON.stringify(editor.value?.state.document)
    }, { deep: true })

    editorStore.tabs.push({
      id: props.id,
      documentName: 0,
      state: createEditorState({
        document: JSON.parse(props.project?.document)
      }),
      history: []
    })

    return {
      editorStore,
      editor
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.editor {
  height: 100%;
  display: grid;

  gap: 1px;
  grid-template-columns: auto 1fr auto;
  grid-template-rows: 1fr;
  grid-auto-rows: auto;

  overflow: hidden;

  &__panel {
    position: relative;

    & > * {
      position: absolute;
      inset: 0;
    }

    &--hierachie {
      width: 250px;
      grid-column: 1 / 2;
    }
    &--properties {
      width: 300px;
      grid-column: 3 / 4;
    }

    &--viewer {
      grid-column: 2 / 3;
    }

    &--timeline {
      grid-column: 1 / 4;
      height: 300px;
    }
  }
}
</style>
