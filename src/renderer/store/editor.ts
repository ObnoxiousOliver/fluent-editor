import { defineStore } from 'pinia'
import { setTransitionHooks } from 'vue'
import { createDocument } from '../models/document/FluentDocument'
import { createSlide } from '../models/document/Slide'
import EditorInstance from '../models/editor/EditorInstance'
import { createEditorState } from '../models/editor/EditorState'
import Rect from '../models/nodes/Rect'
import createTextNode from '../models/nodes/TextNode'
import randomId from '../utils/randomId'

export const useEditor = defineStore('editor', {
  state: () => ({
    tabs: [] as EditorInstance[],
    currentTab: 0
  }),
  actions: {
    newTab () {
      const numbers = this.tabs
        .filter(x => typeof (x.documentName) === 'number')
        .map(x => x.documentName as number)

      const slide = createSlide()

      slide.fill = '#2E3629'
      slide.children.push(createTextNode(new Rect(100, 100)))

      const doc = createDocument({
        slides: [
          slide
        ]
      })

      this.tabs.push({
        id: randomId(),
        documentName: (Math.max(...(numbers.length ? numbers : [0])) || 0) + 1,
        state: createEditorState({
          document: doc
        }),
        history: []
      })
      this.currentTab = this.tabs.length
    },
    closeTab (i: number) {
      this.tabs.splice(i, 1)

      if (this.currentTab - 1 > i || this.currentTab > this.tabs.length) {
        this.currentTab--
      }
    }
  },
  getters: {
    /**
     * @deprecated
     */
    currentEditor (): EditorInstance | null {
      return this.tabs[this.currentTab - 1] as EditorInstance
    }
  }
})
