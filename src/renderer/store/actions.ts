import { defineStore } from 'pinia'
import Action from '@/renderer/models/actions/Action'

export const useActions = defineStore('actions', {
  state: () => ({
    registeredActions: {} as { [x: string]: Action },
    inAppMenu: false,
    cursor: null as string | null
  }),
  actions: {
    addAction (action: Action) {
      this.registeredActions[action.id] = action
    },
    execute (id: string, ...args: any[]) {
      if (this.registeredActions[id]) {
        console.log('%c[Actions]', 'color: #f34;', 'Executing: ' + id)

        if (this.registeredActions[id].hooks) {
          this.registeredActions[id].hooks!.forEach(x => x(...args))
        }
      } else {
        console.log('%c[Actions]', 'color: #f34;', 'Error: No action with id ' + id)
      }
    },
    hook (id: string, ...hooks: Function[]) {
      if (this.registeredActions[id]) {
        if (!this.registeredActions[id].hooks) this.registeredActions[id].hooks = []

        this.registeredActions[id].hooks!.push(...hooks)
      } else {
        console.log('%c[Actions]', 'color: #f34;', 'Error: No action with id ' + id)
      }
    },
    unhook (id: string, ...hooks: Function[]) {
      if (this.registeredActions[id]) {
        if (this.registeredActions[id].hooks) {
          hooks.forEach(x => {
            this.registeredActions[id].hooks =
              this.registeredActions[id].hooks!.filter(y => y !== x)
          })
        }
      } else {
        console.log('%c[Actions]', 'color: #f34;', 'Error: No action with id ' + id)
      }
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
