<template>
  <AppLayout>
    <!-- <AppTabsView :tabindex="editorStore.currentTab" /> -->

    <Suspense>
      <router-view />
    </Suspense>
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
import { config } from '../utils/config'
import { extendTool } from '../models/editor/tools/Tool'

import { SelectionTool } from '../tools/selection/selection'
import { TextBoxTool } from '../tools/textbox/textbox'

import { useActions, useEditor, useRuntime } from '../store'

import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { reloadUser, updateUserState } from '../firebase/auth'

import AppLayout from './AppLayout.vue'
import { subscribeToUserDocumentChanges } from '../firebase/firestore'
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
    // TODO: Remove in production
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
    // TODO: Move to a plugin
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
    // TODO: Move to a plugin
    extendTool(SelectionTool)
    extendTool(TextBoxTool)

    // Handle Auth
    const auth = getAuth()

    onMounted(() => {
      var reloadIntervalId: number | undefined

      // Listen for auth state changes
      var unsubscribeUserDocumentChanges: Function
      var unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        updateUserState(user)
        if (user) {
          if (reloadIntervalId) {
            clearInterval(reloadIntervalId)
          }

          // Create reload interval
          reloadIntervalId = setInterval(() => reloadUser(), 60 * 1000)

          // Subscribe from user document changes
          unsubscribeUserDocumentChanges = subscribeToUserDocumentChanges()
        } else {
          // Clear Reload Interval
          clearInterval(reloadIntervalId)
          reloadIntervalId = undefined

          // Unsubscribe from user document changes
          unsubscribeUserDocumentChanges()
        }
      })

      // Unsubscribe from auth state changes
      onBeforeUnmount(() => {
        clearInterval(reloadIntervalId)
        unsubscribeAuth()
      })
    })

    return {
      actions,
      editorStore
    }
  }
})
</script>

<style lang="scss" src="../scss/base.scss" />
