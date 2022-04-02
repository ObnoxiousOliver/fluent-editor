<template>
  <div class="viewer-header">
    <div class="viewer-header__start">
      <ViewerHeaderButton>
        <oi i="arrow-counterclockwise" />
      </ViewerHeaderButton>
      <ViewerHeaderButton>
        <oi i="arrow-clockwise" />
      </ViewerHeaderButton>

      <div class="viewer-header__divider" />

      <ViewerHeaderButton
        v-for="tool in tools"
        :key="tool.name"
        :active="tool.name === editor_.state.activeTool"
        @click="editor_.state.activeTool = tool.name"
      >
        <oi :i="tool.icon" />
      </ViewerHeaderButton>
    </div>
    <div class="viewer-header__end">
      <Popper placement="bottom">
        <ViewerHeaderButton>
          <oi i="floppy" />
        </ViewerHeaderButton>
        <template #content>Save</template>
      </Popper>
      <Popper placement="bottom">
        <ViewerHeaderButton>
          <oi i="play" />
        </ViewerHeaderButton>
        <template #content>Preview Presenation</template>
      </Popper>
      <Popper placement="bottom">
        <ViewerHeaderButton
          class="viewer-header__zoom"
          :multiple="true"
        >
          <span class="viewer-header__zoom__text">{{ Math.round(editor_.state.canvas.scale * 100) }}%</span>
        </ViewerHeaderButton>
        <template #content>Zoom options</template>
      </Popper>
    </div>
  </div>
</template>

<script lang="ts">
import ViewerHeaderButton from '@/renderer/components/editor/viewer/ViewerHeaderButton.vue'
import Popper from '@/renderer/components/popper/Popper.vue'
import EditorInstance from '@/renderer/models/editor/EditorInstance'
import { tools } from '@/renderer/models/editor/tools/Tool'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { ViewerHeaderButton, Popper },
  props: {
    editor: Object
  },
  setup (props) {
    const editor_ = ref(props.editor as EditorInstance | null)

    return {
      editor_,
      tools
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.viewer-header {
  display: flex;
  flex-flow: row;

  @include r.light {
    background: r.$col-white;
  }
  @include r.dark {
    background: r.$col-700;
  }

  &__start {
    flex: 1 1 auto;
    display: flex;
    height: 40px;
    padding: 0 2.5px;
  }
  &__end {
    flex: 0 0 auto;
    display: flex;
    height: 40px;
    padding: 0 2.5px;
  }

  &__divider {
    width: 2px;
    margin: 10px 7.5px;
    border-radius: 1px;

    @include r.light {
      background: r.$col-100;
    }
    @include r.dark {
      background: r.$col-500;
    }
  }

  &__zoom {
    &__text {
      font-size: 0.75rem;
    }
  }

  .popper-target {
    display: grid;
  }
}
</style>
