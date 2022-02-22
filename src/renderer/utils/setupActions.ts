import { useActions, useEditor } from '../store'
import { config } from './config'

declare const global: any

export default function setup () {
  const actions = useActions()

  // App Navigation
  // actions.addAction({
  //   id: 'focus-app-menu',
  //   keyboardShortcuts: [
  //     ['alt']
  //   ],
  //   executeInAppMenu: true
  // })

  actions.addAction({
    id: 'exit',
    name: 'appMenu.exit.name',
    hooks: [() => { global.electron.window.close() }]
  })

  // Color Theme
  actions.addAction({
    id: 'set-theme-dark',
    hooks: [() => config.set('theme', 'dark')]
  })
  actions.addAction({
    id: 'set-theme-light',
    hooks: [() => config.set('theme', 'light')]
  })
  actions.addAction({
    id: 'set-theme-system',
    hooks: [() => config.set('theme', null)]
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
