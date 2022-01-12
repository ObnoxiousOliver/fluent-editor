import { defineStore } from 'pinia'
import { createDocument } from '../models/document/FluentDocument'

export const useEditor = defineStore('editor', {
  state: () => {
    return {
      document: createDocument(),
      slideIndex: 0
    }
  }
})
