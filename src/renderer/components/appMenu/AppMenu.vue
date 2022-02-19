<template>
  <div
    class="app-menu"
    @keydown.exact.right="right"
    @keydown.exact.left="left"
    @keydown.exact.up="up"
    @keydown.exact.down="down"
    @keydown="keydown"
  >
    <AppMenuButton
      v-for="(item, i) in menu"
      :key="item.id"

      @blur="blur(i)"
      @click="click(i)"
      @mouseenter="mouseenter(i)"

      @setFocus="(f) => focusedMenu = f"

      :item="item"
      :altFocus="!!focusedMenu"
      :focused="focusedMenu ? focusedMenu[0] === i : false"

      :focus="focusedMenu"
      :index="i"

      tabindex="-1"
    />
  </div>
</template>

<script lang="ts">
import { computed, ref } from '@vue/reactivity'
import AppMenuButton from './AppMenuButton.vue'
import { watch } from '@vue/runtime-core'

import AppMenuItem from '@/renderer/models/appMenu/AppMenuItem'
import { useActions } from '../../store'
import { useI18n } from 'vue-i18n'

export default {
  components: {
    AppMenuButton
  },

  setup () {
    const { t } = useI18n()
    const actions = useActions()

    const getI18nMenuItem = (id: string) => ({
      id,
      name: t(`appMenu.${id}.name`),
      altKeyShortcutLetter: t(`appMenu.${id}.key`)
    })

    const APP_MENU: AppMenuItem[] = [
      {
        ...getI18nMenuItem('file'),
        submenu: [
          { ...getI18nMenuItem('newFile'), icon: 'file-earmark-plus', action: 'new-file' },
          { ...getI18nMenuItem('openFile'), icon: 'folder', action: 'open-file' },
          { role: 'divider', id: '' },
          { ...getI18nMenuItem('save'), action: 'save' },
          { ...getI18nMenuItem('saveAs'), action: 'save-as' },
          { role: 'divider', id: '' },
          { ...getI18nMenuItem('exit'), icon: 'x', action: 'exit' }
        ]
      },
      {
        ...getI18nMenuItem('edit'),
        submenu: [
          { ...getI18nMenuItem('undo'), icon: 'arrow-counterclockwise', action: 'undo' },
          { ...getI18nMenuItem('redo'), icon: 'arrow-clockwise', action: 'redo' },
          { role: 'divider', id: '' },
          { ...getI18nMenuItem('cut'), action: 'cut' },
          { ...getI18nMenuItem('copy'), action: 'copy' },
          { ...getI18nMenuItem('paste'), action: 'paste' },
          { role: 'divider', id: '' },
          { ...getI18nMenuItem('preferences'), icon: 'sliders' }
        ]
      },
      {
        ...getI18nMenuItem('help'),
        submenu: [
          { ...getI18nMenuItem('checkForUpdates'), action: 'check-for-updates' },
          { role: 'divider', id: '' },
          { ...getI18nMenuItem('about'), icon: 'info-circle', action: 'about' }
        ]
      }
    ]

    const menu = ref(APP_MENU)
    // const focused = ref(false)

    const focusedMenu = ref(null as number[] | null)

    const appMenuActivePlain = computed(() => {
      var _menu: any = menu.value

      if (!focusedMenu.value) return []

      focusedMenu.value.some(n => {
        if (_menu[n]?.submenu) {
          _menu = _menu[n]?.submenu as AppMenuItem[]
        } else {
          return true
        }
      })

      return _menu
    })

    var activeElement: any = null

    watch(focusedMenu, () => {
      actions.inAppMenu = !!focusedMenu.value
    })

    actions.hook('focus-app-menu', () => {
      if (activeElement) {
        if (!!activeElement.focus && activeElement.tagName !== 'BODY') {
          activeElement.focus()
        } else {
          if (document.activeElement) {
            (document.activeElement as any).blur()
          }
        }

        activeElement = null
        focusedMenu.value = null
      } else {
        activeElement = document.activeElement

        focusedMenu.value = [0]
      }
    })

    function blur (i: number) {
      if (focusedMenu.value && focusedMenu.value[0] === i) {
        activeElement = null
        focusedMenu.value = null
      }
    }

    // Mouse Navigation

    function click (i: number) {
      focusedMenu.value = [i, 0]
    }
    function mouseenter (i: number) {
      if (focusedMenu.value && focusedMenu.value.length > 1) {
        focusedMenu.value = [i, 0]
      }
    }

    // Keyboard Navigation

    function keydown (e: KeyboardEvent) {
      if (!focusedMenu.value) return

      var i = appMenuActivePlain.value.findIndex((x: AppMenuItem) => x.altKeyShortcutLetter === e.key.toLowerCase())

      if (i !== -1) {
        focusedMenu.value[focusedMenu.value?.length - 1] = i
        focusedMenu.value[focusedMenu.value?.length] = 0
      }
    }

    function right () {
      var target = (focusedMenu.value?.[0] ?? -1) + 1

      focusedMenu.value = [
        target < menu.value.length ? target : 0,
        ...(!!focusedMenu.value?.length && focusedMenu.value?.length > 1 ? [0] : [])
      ]
    }
    function left () {
      var target = (focusedMenu.value?.[0] ?? 1) - 1

      focusedMenu.value = [
        target >= 0 ? target : menu.value.length - 1,
        ...(!!focusedMenu.value?.length && focusedMenu.value?.length > 1 ? [0] : [])
      ]
    }
    function up () {
      if (focusedMenu.value) {
        var target = focusedMenu.value[focusedMenu.value.length - 1] - 1

        if (target < 0) {
          target = appMenuActivePlain.value?.filter((x: AppMenuItem) => x.role !== 'divider').length - 1
        }

        focusedMenu.value[focusedMenu.value.length - 1] = target
      }
    }
    function down () {
      if (focusedMenu.value && focusedMenu.value.length === 1) {
        focusedMenu.value.push(0)
      } else if (focusedMenu.value && focusedMenu.value.length > 1) {
        var target = focusedMenu.value[focusedMenu.value.length - 1] + 1

        if (target > appMenuActivePlain.value?.filter((x: AppMenuItem) => x.role !== 'divider').length - 1) {
          target = 0
        }

        focusedMenu.value[focusedMenu.value.length - 1] = target
      }
    }

    return {
      t,
      actions,
      keydown,
      focusedMenu,
      // focused,
      menu,
      click,
      mouseenter,
      right,
      left,
      up,
      down,
      blur
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.app-menu {
  position: relative;
  z-index: 9998;

  @include r.dark {
    margin-bottom: 1px;
  }

  display: flex;
  background: r.$col-700;

  font-size: 0.8rem;

  -webkit-app-region: drag;
}
</style>
