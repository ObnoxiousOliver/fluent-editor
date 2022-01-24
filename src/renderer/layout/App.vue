<template>
  <AppLayout>
    <AppTabsView :tabindex="editorStore.currentTab">
      <HomeView />
      <template
        v-for="tab in editorStore.tabs"
        :key="tab.id"
      >
        <Editor
          :tabId="tab.id"
        />
      </template>
    </AppTabsView>
  </AppLayout>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from '@vue/runtime-core'

import keybindManager from '../utils/keybindManager'

import { useActions, useEditor } from '../store'
import AppLayout from './AppLayout.vue'
import AppTabsView from './AppTabsView.vue'
import HomeView from './HomeView.vue'
import Editor from './editor/EditorView.vue'

declare var global: any

export default defineComponent({
  name: 'App',
  components: {
    AppLayout,
    AppTabsView,
    HomeView,
    Editor
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

    actions.addAction({
      id: 'exit',
      name: 'appMenu.exit.name',
      callback: () => {
        global.electron.window.close()
      }
    })

    // Handle Actions
    onMounted(() => {
      var { dispose } = keybindManager.initialize()

      onBeforeUnmount(() => dispose())
    })

    onMounted(() => {
      document.addEventListener('keydown', (e) => {
        if (e.composedPath().find((x: any) => x.tagName === 'INPUT')) return

        if (e.key === 'Enter') {
          document.documentElement.classList.toggle('dark')
        }
      })
    })

    return {
      editorStore
    }
  }
})
</script>

<style lang="scss">
@use '../scss' as r;

:root {
  font-family: r.$type;
  font-size: 16px;
  user-select: none;
  overflow: hidden;
}

body {
  @include r.light {
    background: r.$col-white;
    color: r.$col-900;
  }
  @include r.dark {
    background: r.$col-700;
    color: r.$col-white;
  }
}

*, ::before, ::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:focus-visible {
  outline: r.$col-primary solid 1px;
  outline-offset: -1px;
}

::selection {
  background: rgba(r.$col-primary, .8);
  color: r.$col-white;
}
</style>
