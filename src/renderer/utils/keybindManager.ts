import { useActions } from '@/renderer/store'
import keycode from 'keycode'

export default {
  initialize () {
    const actionStore = useActions()

    let pressedKeys: any = {}
    let keys: number[] = []
    let keybindExecuted: boolean = false

    function keydown (e: KeyboardEvent) {
      if (e.composedPath().find((x: any) => x.tagName === 'INPUT')) return

      // if (!['Control', 'Shift', 'Meta', 'Alt'].includes(e.key)) {
      pressedKeys[e.keyCode] = true
      // }

      setKeys(/* e.shiftKey, e.altKey, e.ctrlKey, e.metaKey */)

      // console.log(actionStore.getKeyboardShortcuts
      //   .filter(x => keys?.every((key: number) => x.shortcut.map(x => keycode(x)).includes(key))))

      console.log('%c[Pressed Keys]', 'color: #3ef;', keys.map(x => keycode(x)).join(', '))

      if (actionStore.getKeyboardShortcuts
        .filter(x => keys?.every((key: any) => x.shortcut.map(x => keycode(x)).includes(key))).length === 1 ||
        actionStore.inAppMenu) {
        keybindExecuted = true
        executeKeybinds()
      }
    }

    function keyup (e: KeyboardEvent) {
      if (!keybindExecuted) {
        executeKeybinds()
      }

      keybindExecuted = false

      pressedKeys[e.keyCode] = false

      setKeys(/* e.shiftKey, e.altKey, e.ctrlKey, e.metaKey */)
    }

    function resetKeys () {
      pressedKeys = []
    }

    function setKeys (
      /* shiftKey: boolean,
      altKey: boolean,
      ctrlKey: boolean,
      metaKey: boolean */) {
      // keys = [
      //   shiftKey && 'shift',
      //   altKey && 'alt',
      //   (ctrlKey || metaKey) && 'mod',
      //   ...Object.keys(pressedKeys).filter(x => pressedKeys[x])
      // ].filter(x => x)

      keys = Object.keys(pressedKeys).filter(x => pressedKeys[x]).map(x => +x)
    }

    function getSelectedActions () {
      return Object.values(actionStore.registeredActions)
        .filter(action => action.keyboardShortcuts?.some(shortcut =>
          keys.every(key => shortcut.map(x => x.toLowerCase()).includes(keycode(key))) &&
          shortcut.every(key => keys.map(x => keycode(x)).find(x => x === key.toLowerCase()))
        ))
    }

    function executeKeybinds () {
      getSelectedActions().forEach(x => {
        if (!actionStore.inAppMenu || x.executeInAppMenu) {
          actionStore.execute(x.id)
        }
      })
    }
    document.addEventListener('keydown', keydown)
    document.addEventListener('keyup', keyup)
    window.addEventListener('blur', resetKeys)

    return {
      dispose () {
        document.removeEventListener('keydown', keydown)
        document.removeEventListener('keyup', keyup)
        window.removeEventListener('blur', resetKeys)
      }
    }
  }
}
