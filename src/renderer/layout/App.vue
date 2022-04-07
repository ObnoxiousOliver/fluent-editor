<template>
  <AppLayout>
    <!-- <AppTabsView :tabindex="editorStore.currentTab" /> -->
    <router-view />
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

import { useActions, useEditor, useRuntime, useUserState } from '../store'
import AppLayout from './AppLayout.vue'
import { config } from '../utils/config'
import { extendTool } from '../models/editor/tools/Tool'
import { SelectionTool } from '../tools/selection/selection'
import { TextBoxTool } from '../tools/textbox/textbox'
import { getAuth, onAuthStateChanged, User } from '@firebase/auth'
// import HomeView from './HomeView.vue'
// import Editor from './editor/EditorView.vue'

export default defineComponent({
  name: 'App',
  components: {
    AppLayout
  },

  setup () {
    const editorStore = useEditor()
    const runtime = useRuntime()
    const actions = useActions()

    // Sync document store with local storage
    try {
      editorStore.$patch(JSON.parse(localStorage.getItem('editorState') ?? ''))
      editorStore.tabs.forEach(x => runtime.addTab(x.id))
    } catch {}

    editorStore.$subscribe((_, state) => {
      localStorage.setItem('editorState', JSON.stringify(state))
    })

    // Handle Actions
    setupActions()

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

    // Handle Tools
    extendTool(SelectionTool)
    extendTool(TextBoxTool)

    // Handle Authorisation
    const userState = useUserState()

    onMounted(() => {
      // Listen for auth state changes
      onAuthStateChanged(getAuth(), (user) => {
        updateUser(user)
      })

      function updateUser (user: User | null) {
        userState.user = user
        userState.displayName = user?.displayName ?? ''
        userState.isLoggedIn = !!user
      }
    })

    return {
      actions,
      editorStore
    }
  }
})
</script>

<style lang="scss" src="../scss/base.scss" />
