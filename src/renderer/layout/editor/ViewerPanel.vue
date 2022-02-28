<template>
  <div class="viewer-panel">
    <ViewerHeader :editor="editor_" />
    <SlideCanvas :editor="editor_" />
  </div>
</template>

<script lang="ts">
import SlideCanvas from '../../components/editor/SlideCanvas.vue'
import { defineComponent, ref } from 'vue'
import ViewerHeader from './ViewerHeader.vue'

export default defineComponent({
  components: {
    SlideCanvas,
    ViewerHeader
  },
  props: {
    editor: Object
  },

  setup (props) {
    const editor_ = ref(props.editor)

    return {
      editor_
    }
  }
})
</script>

<style lang="scss" scoped>
.viewer-panel {
  display: flex;
  flex-flow: column nowrap;
  gap: 1px;

  height: 100%;
}

.slide-canvas {
  flex: 1 1 auto;
  height: 100%;
}
</style>
