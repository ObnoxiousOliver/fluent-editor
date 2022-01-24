import { createApp } from 'vue'

// Plugins
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

// Components
import App from './layout/App.vue'
import NodeDisplay from './components/document/nodes/NodeDisplay.vue'
import FluentInput from './components/Input.vue'
import Bi from './components/Bi.vue'

// Utils
import bem from './utils/bem'

// I18n
import langEn from './i18n/en'
import langDe from './i18n/de'

const pinia = createPinia()

const i18n = createI18n({
  locale: 'de',
  fallbackLocale: 'en',
  messages: {
    en: langEn,
    de: langDe
  }
})

createApp(App)
  .use(pinia)
  .use(i18n)
  .mixin({ created () { this.$bem = bem } })
  .component('bi', Bi)
  .component('FluentInput', FluentInput)
  .component('NodeDisplay', NodeDisplay)
  .mount('#app')
