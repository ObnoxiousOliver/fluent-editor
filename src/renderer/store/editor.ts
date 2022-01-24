import { defineStore } from 'pinia'
import { createDocument } from '../models/document/FluentDocument'
import { createSlide } from '../models/document/Slide'
import EditorInstance from '../models/editor/EditorInstance'
import { createEditorState } from '../models/editor/EditorState'
import Vector from '../models/nodes/Vector'
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

      const slide = createSlide(undefined, undefined, {
        type: 'linear',
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 1,
        stops: [
          { color: '#303', offset: 0 },
          { color: '#033', offset: 1 }
        ]
      })

      slide.root.children.push(new Vector()
        .setVector('rect')
        .setFill('#39f')
        .setRect({
          height: 100,
          width: 200,
          x: 0,
          y: 400
        }))

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
        })
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
    currentEditor (state) {
      return state.tabs[state.currentTab - 1]
    }
  }
})
