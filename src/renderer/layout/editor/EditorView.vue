<template>
  <div class="editor">
    <div :class="$bem('editor__panel', 'hierachie')">
      <HierachiePanel :editor="editor" />
    </div>
    <div :class="$bem('editor__panel', 'viewer')">
      <ViewerPanel :editor="editor" />
    </div>
    <div :class="$bem('editor__panel', 'properties')">
      <PropertiesPanel :editor="editor" />
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
import { computed, defineComponent } from 'vue'
import { useEditor } from '../../store'

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
    tabId: String
  },

  setup (props) {
    const editorStore = useEditor()

    const editor = computed(() => editorStore.tabs.find(x => x.id === props.tabId))

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
