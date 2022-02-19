<template>
  <AppLayout>
    <AppTabsView :tabindex="editorStore.currentTab" />
  </AppLayout>

  <teleport to="head">
    <component
      v-if="actions.cursor"
      :is="'style'"
    >
      * { cursor: {{ actions.cursor }} !important }
    </component>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from '@vue/runtime-core'

import keybindManager from '../utils/keybindManager'
import setupActions from '../utils/setupActions'

import { useActions, useEditor } from '../store'
import AppLayout from './AppLayout.vue'
import AppTabsView from './AppTabsView.vue'
// import HomeView from './HomeView.vue'
// import Editor from './editor/EditorView.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppLayout,
    AppTabsView
    // HomeView,
    // Editor
    // SlideRenderer
  },

  setup () {
    const editorStore = useEditor()
    const actions = useActions()

    // Sync document store with local storage
    try {
      editorStore.$patch(JSON.parse(localStorage.getItem('editorState') ?? ''))
    } catch {}

    editorStore.$subscribe((_, state) => {
      localStorage.setItem('editorState', JSON.stringify(state))
    })

    setupActions()

    // Handle Actions
    onMounted(() => {
      var { dispose } = keybindManager.initialize()

      onBeforeUnmount(() => dispose())
    })

    return {
      actions,
      editorStore
    }
  }
})
</script>

<style lang="scss" src="../scss/base.scss" />
