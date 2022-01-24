import { defineStore } from 'pinia'
import Action from '@/renderer/models/actions/Action'

export const useActions = defineStore('actions', {
  state: () => ({
    registeredActions: {} as { [x: string]: Action },
    inAppMenu: false
  }),
  actions: {
    addAction (action: Action) {
      this.registeredActions[action.id] = action
    },
    execute (id: string, ...args: any[]) {
      console.log('%c[Actions]', 'color: #f34;', 'Executing: ' + id)
      this.registeredActions[id].callback(...args)
    }
  },
  getters: {
    getKeyboardShortcuts () {
      const shortcuts: {
        shortcut: string[],
        id: string
      }[] = []

      Object.values(this.registeredActions).forEach(action => {
        if (action.keyboardShortcuts) {
          action.keyboardShortcuts.forEach(shortcut => {
            shortcuts.push({
              shortcut,
              id: action.id
            })
          })
        }
      })

      return shortcuts
    }
  }
})
