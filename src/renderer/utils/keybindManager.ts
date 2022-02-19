import { useActions } from '@/renderer/store'
import keycode from 'keycode'

export let pressedKeys: any = {}
export let ignoreKeys: number[] = []

export function ignoreKey (key: number, ignore: boolean = true) {
  if (ignore && !ignoreKeys.includes(key)) {
    ignoreKeys.push(key)
  }
  if (!ignore) {
    ignoreKeys = ignoreKeys.filter(x => x !== key)
  }
}

export default {
  initialize () {
    const actionStore = useActions()

    let keys: number[] = []
    let keybindExecuted: boolean = false

    function keydown (e: KeyboardEvent) {
      pressedKeys[e.keyCode] = true

      setKeys()

      if (keys.length) {
        console.log('%c[Pressed Keys]', 'color: #3ef;', keys.map(x => keycode(x)).join(', '))
      }

      if (e.composedPath().some((x: any) => x.tagName === 'INPUT' || x.isContentEditable) &&
        !keys.map(x => keycode(x)).find(x => ['ctrl', 'alt', 'left command', 'right command'].includes(x))) {
        return
      }

      if (actionStore.getKeyboardShortcuts
        .filter(x => keys?.every((key: any) => x.shortcut.map(x => keycode(x)).includes(key))).length === 1 ||
        actionStore.inAppMenu) {
        e.preventDefault()
        keybindExecuted = true
        executeKeybinds()
      }
    }

    function keyup (e: KeyboardEvent) {
      if (!keybindExecuted) {
        e.preventDefault()
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

      keys = Object.keys(pressedKeys).filter(x => pressedKeys[x] && !ignoreKeys.includes(+x)).map(x => +x)
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
