import { isBrowser } from './browser'

declare let global: {
  electron: any
}

export type ConfigValue = { [x: string]: ConfigValue } | string | number | boolean | null | undefined
export type ConfigListeners = 'update'

export const configData: { [x: string]: ConfigValue } = {}

const listeners: {
  [x: string]: Function[]
} = {}

function onUpdate (path?: string) {
  listeners['update' as ConfigListeners] &&
  listeners['update' as ConfigListeners].forEach(x => x(path))
}

export const config = {
  get (path: string = ''): ConfigValue {
    const _path = path.split('.')

    let currentItem: any = configData

    _path.some((key, i) => {
      if (i === _path.length - 1) return

      if (typeof (currentItem[key]) !== 'object') {
        currentItem = undefined
        return true
      }

      currentItem = currentItem[key]
    })

    return currentItem?.[_path[_path.length - 1]]
  },
  set (path: string, value: ConfigValue) {
    const _path = path.split('.')

    let currentItem: any = configData

    _path.some((key, i) => {
      if (i === _path.length - 1) return

      if (currentItem[key] === undefined) {
        currentItem[key] = {}
      }

      currentItem = currentItem[key]
    })

    if (typeof (currentItem) === 'object') {
      currentItem[_path[_path.length - 1]] = value
      onUpdate(path)
    } else {
      throw new Error('[Config]: invalid Path')
    }
  },
  on (channel: ConfigListeners, listener: Function) {
    if (!listeners[channel]) {
      listeners[channel] = []
    }

    listeners[channel].push(listener)
  }
}

export function setupConfig () {
  if (isBrowser) {
    // Load from LocalStorage
    try {
      const storedConfig = JSON.parse(localStorage.getItem('config') ?? '{}')

      Object.keys(storedConfig).forEach(key => config.set(key, storedConfig[key]))
    } catch {}

    // update LocalStorage on changes
    config.on('update', () => {
      localStorage.setItem('config', JSON.stringify(configData))
    })
  } else {
    // Get config from file
    const configFile: { [x: string]: ConfigValue } = global.electron.config.getSync()
    Object.keys(configFile).forEach(key => config.set(key, configFile[key]))

    // Listen to file changes
    global.electron.config.listen((configFile: { [x: string]: ConfigValue }) => {
      Object.keys(configFile).forEach(key => config.set(key, configFile[key]))
    })

    // update Config File on changes
    config.on('update', () => {
      global.electron.config.update(configData)
    })
  }
}
