import { useActions, useEditor } from '../store'

declare const global: any

export default function setup () {
  const actions = useActions()

  // App Navigation
  actions.addAction({
    id: 'focus-app-menu',
    keyboardShortcuts: [
      ['alt']
    ],
    executeInAppMenu: true
  })

  actions.addAction({
    id: 'exit',
    name: 'appMenu.exit.name',
    hooks: [() => { global.electron.window.close() }]
  })

  actions.addAction({
    id: 'toggle-dark-mode',
    keyboardShortcuts: [['ctrl', 'space']],
    hooks: [() => document.documentElement.classList.toggle('dark')]
  })

  actions.addAction({
    id: 'new-tab',
    keyboardShortcuts: [['ctrl', 't']],
    hooks: [() => useEditor().newTab()]
  })

  // Canvas Navigation
  actions.addAction({
    id: 'canvas-zoom-1',
    keyboardShortcuts: [['ctrl', '0']]
  })
  actions.addAction({
    id: 'canvas-zoom-fit-to-screen',
    keyboardShortcuts: [['ctrl', '1']]
  })
  actions.addAction({
    id: 'canvas-zoom-in',
    keyboardShortcuts: [['ctrl', '=']]
  })
  actions.addAction({
    id: 'canvas-zoom-out',
    name: 'Zoom In',
    keyboardShortcuts: [['ctrl', '-']]
  })

  // Edit
  actions.addAction({
    id: 'delete',
    keyboardShortcuts: [['delete']]
  })
}

/*

TODO:
Actions hooks

*/
