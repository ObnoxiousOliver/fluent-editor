import { createApp } from 'vue'

// Initialize Firebase
import './firebase'

// Plugins
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { router } from './router'

// Components
import App from './layout/App.vue'
import NodeDisplay from './components/document/nodes/NodeDisplay.vue'
import ProptertiesPanelItem from './components/properties/ProptertiesPanelItem.vue'
import FluentInput from './components/Input.vue'
import FluentNumberInput from './components/NumberInput.vue'
import Bi from './components/Bi.vue'
import Oi from './components/Oi.vue'

// Utils
import bem from './utils/bem'
import mq from './utils/mq'

// I18n
import langEn from './i18n/en'
import langDe from './i18n/de'
import langFr from './i18n/fr'
import { isBrowser } from './utils/browser'
import { config, setupConfig } from './utils/config'

// Initialize Config
setupConfig()

// Initialize Pinia
const pinia = createPinia()

// Initialize i18n
const i18n = createI18n({
  locale: config.get('local') as string | null | undefined || navigator.language,
  fallbackLocale: 'en',
  messages: {
    en: langEn,
    de: langDe,
    fr: langFr
  },
  silentFallbackWarn: true,
  silentTranslationWarn: true
})

// Initialize Vue
createApp(App)
  .use(pinia)
  .use(i18n)
  .use(router)
  .use(mq)
  .mixin({ created () { this.$bem = bem } })
  .component('bi', Bi)
  .component('oi', Oi)
  .component('FluentInput', FluentInput)
  .component('FluentNumberInput', FluentNumberInput)
  .component('NodeDisplay', NodeDisplay)
  .component('ProptertiesPanelItem', ProptertiesPanelItem)
  .mount('#app')

// Create isBrowser class
if (isBrowser) {
  document.documentElement.classList.add('isBrowser')
}

// devtools
(window as any).config = {
  set: config.set,
  get: config.get
}

// Prevent Zooming
document.querySelector('#app')!.addEventListener('wheel', (e: any) => e.ctrlKey && e.preventDefault())
