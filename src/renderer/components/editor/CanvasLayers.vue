<template>
  <div
    class="canvas-layers"
    :style="{
      width: editor_.state.document.meta.size.width * scale + 'px',
      height: editor_.state.document.meta.size.height * scale + 'px'
    }"
  >
    <div class="canvas-layers__slide-name">
      <DoubleClickInput
        v-model="slideName"
        :placeholder="$t('document.slide', [editor_.state.activeSlide + 1])"
      />
    </div>
  </div>
</template>

<script lang="ts">
import EditorInstance from '@/renderer/models/editor/EditorInstance'
import { computed, defineComponent, ref } from 'vue'
// import { useI18n } from 'vue-i18n'
import DoubleClickInput from '../DoubleClickInput.vue'

export default defineComponent({
  components: { DoubleClickInput },
  props: {
    editor: Object,
    scale: Number
  },

  setup (props) {
    const editor_ = ref(props.editor as EditorInstance)

    // const { t } = useI18n()

    const slideName = computed({
      get: () : string | null => editor_.value?.state.document.slides[editor_.value?.state.activeSlide].name,
      set (val: string | null) {
        if (editor_.value) {
          editor_.value.state.document.slides[editor_.value.state.activeSlide].name = val || null
        }
      }
    })

    return {
      editor_,
      slideName
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
}
</style>
