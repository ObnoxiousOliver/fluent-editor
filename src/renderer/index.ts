import { createApp } from 'vue'

// Plugins
import { createPinia } from 'pinia'
import { createI18n, useI18n } from 'vue-i18n'

// Components
import App from './layout/App.vue'
import NodeDisplay from './components/document/nodes/NodeDisplay.vue'
import ProptertiesPanelItem from './components/properties/ProptertiesPanelItem.vue'
import FluentInput from './components/Input.vue'
import FluentNumberInput from './components/NumberInput.vue'
import Bi from './components/Bi.vue'

// Utils
import bem from './utils/bem'

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
  .mixin({ created () { this.$bem = bem } })
  .component('bi', Bi)
  .component('FluentInput', FluentInput)
  .component('FluentNumberInput', FluentNumberInput)
  .component('NodeDisplay', NodeDisplay)
  .component('ProptertiesPanelItem', ProptertiesPanelItem)
  .mount('#app')

// Create isBrowser class
if (isBrowser) {
  document.documentElement.classList.add('isBrowser')
}

// Prevent Zooming
document.querySelector('#app')!.addEventListener('wheel', (e: any) => e.ctrlKey && e.preventDefault())
