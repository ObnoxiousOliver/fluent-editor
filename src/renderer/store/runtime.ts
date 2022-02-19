import { defineStore } from 'pinia'
import { useEditor } from '.'
import ElementStoreInstance from '../models/editor/ElementStoreInstance'
import RegistedElement from '../models/editor/RegistedElement'

export const useRuntime = defineStore('runtime', {
  state: () => ({
    tabs: {} as { [x: string]: ElementStoreInstance },
    movingElement: false
  }),
  actions: {
    getOrder (id: string, editorId: string) {
      const mapChildren = (x: any) => [x.id, x.children ? x.children.map(mapChildren) : []]

      const state = useEditor().tabs.find(x => x.id === editorId)?.state
      if (!state) return

      return state.document.slides[state.activeSlide].children.map(mapChildren).flat(Infinity).indexOf(id)
    }
  },
  getters: {
    /**
     * @deprecated
     */
    currentTab (): ElementStoreInstance | null {
      const editor = useEditor()
      if (!editor.currentEditor) return null

      return this.tabs[editor.currentEditor.id]
    }
    // currentTabsRegisteredElements () {
    //   const registeredElements = this.currentTab?.registeredElements

    //   if (!registeredElements) return {}
    //   console.log(registeredElements)

    //   const el: { [x: string]: RegistedElement } = {}

    //   Object.keys(registeredElements).forEach(key => { el[key] = registeredElements[key]?.get() })

    //   return el
    // }
  }
})
