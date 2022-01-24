<template>
  <div class="viewer-panel">
    <SlideCanvas :editor="editor_" />
  </div>
</template>

<script lang="ts">
import SlideCanvas from '../../components/editor/SlideCanvas.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { SlideCanvas },
  props: {
    editor: Object
  },

  setup (props, { emit }) {
    const editor_ = ref(props.editor)

    return {
      editor_
    }
  }
})
</script>

<style lang="scss" scoped>
.viewer-panel {
  height: 100%;
}

.slide-canvas {
  height: 100%;
}
</style>
