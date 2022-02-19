<template>
  <div
    class="canvas-layers"
    :style="{
      width: editor_.state.document.meta.size.width * scale + 'px',
      height: editor_.state.document.meta.size.height * scale + 'px'
    }"
  >
    <svg
      v-if="scale > 5"
      :viewBox="[
        0,
        0,
        editor_.state.document.meta.size.width,
        editor_.state.document.meta.size.height
      ].join(' ')"
      class="canvas-layers__pixel-grid"
    >
      <path
        stroke="currentColor"
        :stroke-width="1 / scale"
        :opacity="Math.min(1, Math.max(0, (scale - 5) / 10))"
        :d="pixelGrid"
      />
    </svg>
    <div class="canvas-layers__slide-name">
      <DoubleClickInput
        v-model="slideName"
        :placeholder="$t('document.slide', [editor_.state.activeSlide + 1])"
      />
    </div>
    <div class="canvas-layers__selections">
      <EditingBox
        v-if="editor_.state.selection.editing"
        :key="editor_.state.selection.editing"
        :elementId="editor_.state.selection.editing"
        :scale="scale"
        :editor="editor_"
      />
      <div v-else>
        <HoverBox
          v-if="runtime.currentTab?.hovering[0] && !editor_.state.selection.selection.includes(runtime.currentTab.hovering[0])"
          :key="runtime.currentTab?.hovering[0]"
          :elementId="runtime.currentTab?.hovering[0]"
          :scale="scale"
          :editor="editor_"
        />
        <SelectionBox
          v-for="element in editor_.state.selection.selection"
          :key="element"
          :elementId="element"
          :scale="scale"
          :posX="posX"
          :posY="posY"
          :editor="editor_"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import EditorInstance from '@/renderer/models/editor/EditorInstance'
import { useRuntime } from '@/renderer/store'
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
// import { useI18n } from 'vue-i18n'
import DoubleClickInput from '../DoubleClickInput.vue'
import EditingBox from './EditingBox.vue'
import HoverBox from './HoverBox.vue'
import SelectionBox from './SelectionBox.vue'

export default defineComponent({
  components: { DoubleClickInput, SelectionBox, HoverBox, EditingBox },
  props: {
    editor: Object,
    scale: Number,
    posX: Number,
    posY: Number,
    viewportWidth: Number,
    viewportHeight: Number
  },

  setup (props) {
    const editor_ = ref(props.editor as EditorInstance)
    const runtime = useRuntime()

    // const { t } = useI18n()

    const slideName = computed({
      get: () : string | null => editor_.value?.state.document.slides[editor_.value?.state.activeSlide].name,
      set (val: string | null) {
        if (editor_.value) {
          editor_.value.state.document.slides[editor_.value.state.activeSlide].name = val || null
        }
      }
    })

    const pixelGrid = ref('')

    var worker: Worker | null
    onMounted(() => {
      worker = new Worker('pixelGridWorker.js')

      worker.onmessage = (e) => {
        pixelGrid.value = e.data
      }

      onBeforeUnmount(() => {
        worker && worker.terminate()
      })
    })

    watch(() => [
      editor_.value.state.document.meta.size.width,
      editor_.value.state.document.meta.size.height,
      props.scale,
      props.posX,
      props.posY,
      props.viewportWidth,
      props.viewportHeight], () => updatePixelGrid(), { deep: true })

    function updatePixelGrid () {
      worker && worker.postMessage({
        width: editor_.value.state.document.meta.size.width,
        height: editor_.value.state.document.meta.size.height,
        scale: props.scale,
        posX: props.posX,
        posY: props.posY,
        viewportWidth: props.viewportWidth,
        viewportHeight: props.viewportHeight
      })
    }

    return {
      editor_,
      runtime,
      slideName,
      pixelGrid
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.canvas-layers {
  position: relative;
  pointer-events: none;

  &__slide-name {
    pointer-events: all;
    font-size: 0.8rem;
    position: absolute;
    inset: auto auto 100% 0;
    white-space: nowrap;
    width: max-content;

    &:hover {
      color: r.$col-primary;
    }
  }

  &__pixel-grid {
    position: absolute;
    inset: 0;

    color: r.$col-300;
    opacity: 0.3;
  }
}
</style>
