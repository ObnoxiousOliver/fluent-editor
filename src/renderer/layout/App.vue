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
import { config } from '../utils/config'
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

    // Handel Color Theme
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme)
    config.watch('theme', updateTheme)

    updateTheme()
    function updateTheme () {
      switch (config.get('theme')) {
        case 'dark':
          document.documentElement.classList.add('dark')
          document.documentElement.classList.remove('light')
          break
        case 'light':
          document.documentElement.classList.add('light')
          document.documentElement.classList.remove('dark')
          break
        default:
          var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
          document.documentElement.classList.add(prefersDark ? 'dark' : 'light')
          document.documentElement.classList.remove(prefersDark ? 'light' : 'dark')
      }
    }

    return {
      actions,
      editorStore
    }
  }
})
</script>

<style lang="scss" src="../scss/base.scss" />
