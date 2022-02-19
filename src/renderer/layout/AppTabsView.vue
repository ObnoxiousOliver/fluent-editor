<template>
  <!-- <keep-alive> -->
  <HomeView v-if="editorStore.currentTab === 0" />
  <!-- </keep-alive> -->
  <keep-alive ref="tabs">
    <EditorView
      v-if="editorStore.currentTab !== 0 && editorStore.tabs[editorStore.currentTab - 1]"
      :tabId="editorStore.tabs[editorStore.currentTab - 1]?.id"
      :key="editorStore.tabs[editorStore.currentTab - 1]?.id"
    />
  </keep-alive>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity'
import { defineComponent, watch } from '@vue/runtime-core'
import { useEditor } from '../store'
import EditorView from './editor/EditorView.vue'
import HomeView from './HomeView.vue'

export default defineComponent({
  components: { EditorView, HomeView },
  props: {
    tabindex: { type: Number, default: () => 0 }
  },
  setup () {
    const root = ref(null as HTMLElement | null)
    const tabs = ref(null as HTMLElement | null)
    const editorStore = useEditor()

    watch(() => editorStore.tabs.map(x => x.id), () => {
      try {
        const cache: Map<any, any> = (tabs.value as any)!.$.__v_cache

        Array.from(cache.keys())
          .filter((x: any) => !editorStore.tabs.map(x => x.id).includes(x))
          .forEach(x => cache.delete(x))
      } catch (e: any) {
        console.error('[Error]', 'Something went wrong with the Keep Alive Cache at AppTabsView.', e)
      }
    }, {
      deep: true
    })

    return {
      root,
      tabs,
      editorStore
    }
  }
})
</script>
