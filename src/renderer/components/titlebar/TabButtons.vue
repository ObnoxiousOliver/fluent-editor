<template>
  <div class="tab-btns">
    <TabButton
      :isHome="true"
      :active="editor.currentTab === 0"
      @focusTab="editor.currentTab = 0"
    >
      <bi i="house-door-fill" />
    </TabButton>
    <ScrollViewer
      :x="true"
      :y="false"
      :thin="true"
      :horizontalScroll="true"
      class="tab-btns__scrollviewer"
    >
      <TabButton
        v-for="(tab, i) in editor.tabs"
        :key="tab.id"
        :active="editor.currentTab === i + 1"
        @focusTab="editor.currentTab = i + 1"
        @closeTab="editor.closeTab(i)"
        :title="name(tab)"
      >
        {{ name(tab) }}
      </TabButton>
      <button
        class="tab-btns__new-tab"
        @click="editor.newTab()"
      >
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
        >
          <path
            d="M5.5 0V11M0 5.5H11"
            stroke="currentColor"
          />
        </svg>
      </button>
    </ScrollViewer>
  </div>
</template>

<script lang="ts">
import { useEditor } from '@/renderer/store'
import TabButton from './TabButton.vue'
import { useI18n } from 'vue-i18n'
import { defineComponent } from '@vue/runtime-core'
import EditorInstance from '@/renderer/models/editor/EditorInstance'
import ScrollViewer from '../scrollViewer/ScrollViewer.vue'

export default defineComponent({
  components: {
    TabButton,
    ScrollViewer
  },

  setup (props) {
    const editor = useEditor()
    const { t } = useI18n()

    function name (tab: EditorInstance): string {
      return typeof (tab.documentName) === 'string'
        ? tab.documentName
        : t('document.untitled', [tab.documentName])
    }

    return {
      editor,
      name
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.tab-btns {
  display: flex;
  // padding: 0 5px;
  gap: 1px;

  &__scrollviewer {
    flex: 1 1 auto;
    width: 0;

    :deep(.scroll-viewer__content) {
    display: flex;
    gap: 1px;
    }
  }

  &__new-tab {
    @include r.buttonReset;
    cursor: pointer;

    display: flex;
    align-items: center;

    padding: 0 .5rem;
    color: r.$col-200;

    transition: background .1s, color .1s;

    -webkit-app-region: no-drag;

    &:hover {
      background: r.$col-600;
      color: r.$col-white;
    }
  }
}
</style>
