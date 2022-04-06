<template>
  <div :class="['titlebar', { 'titlebar--maximized': isMaximized }]">
    <div
      v-if="!isBrowser"
      class="titlebar__drag"
    />
    <div class="titlebar__content">
      <div
        v-if="userState.isLoggedIn"
        class="titlebar__controls"
      >
        <FluentInput
          class="titlebar__search dark"
          :placeholder="t('search.placeholder')"
        >
          <template #after>
            <oi i="search" />
          </template>
        </FluentInput>
        <Popper
          ref="userMenu"
          placement="bottom-end"
          type="popup"
        >
          <UserAvatar
            @click="$refs.userMenu.toggle()"
            class="titlebar__avatar"
            :user="userState.user"
          />
          <template #content>
            <UserMenu
              :user="userState.user"
            />
          </template>
        </Popper>
      </div>
      <div
        v-if="!isBrowser"
        class="titlebar__window-controls"
      >
        <div
          @click="minimize()"
          class="titlebar__control"
        >
          <oi i="window-minimize" />
        </div>
        <div
          @click="toggleMaximize()"
          class="titlebar__control"
        >
          <oi
            v-if="isMaximized"
            i="window-restore"
          />
          <oi
            v-else
            i="window-maximize"
          />
        </div>
        <div
          @click="close()"
          class="titlebar__control titlebar__control--danger"
        >
          <oi i="window-close" />
        </div>
      </div>
    </div>
    <!-- <TabButtons class="titlebar__tabs" /> -->
  </div>
</template>

<script lang="ts">
import { useUserState } from '@/renderer/store'
import { isBrowser } from '@/renderer/utils/browser'
import { defineComponent, onMounted, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
// import TabButtons from './TabButtons.vue'
import UserAvatar from '../account/UserAvatar.vue'
import UserMenu from '../account/UserMenu.vue'
import Popper from '../popper/Popper.vue'

declare var global: {
  electron: any
}

export default defineComponent({
  components: {
    // TabButtons
    UserAvatar,
    UserMenu,
    Popper
  },

  setup (props) {
    const { t } = useI18n()

    const isMaximized = ref(false)

    const userState = useUserState()

    onMounted(() => {
      if (isBrowser) return
      global.electron.window.isMaximized((val: boolean) => { isMaximized.value = val })
    })

    function close () {
      if (isBrowser) return
      global.electron.window.close()
    }
    function toggleMaximize () {
      if (isBrowser) return
      if (isMaximized.value) global.electron.window.unmaximize()
      else global.electron.window.maximize()
    }
    function minimize () {
      if (isBrowser) return
      global.electron.window.minimize()
    }

    return {
      t,
      isMaximized,
      close,
      toggleMaximize,
      minimize,
      userState,
      isBrowser
    }
  }
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../../scss' as r;

.titlebar {
  flex: 0 0 44px;
  position: relative;
  z-index: 9999;

  background: r.$col-900;
  color: r.$col-white;
  height: 44px;
  width: 100vw;

  display: flex;
  flex-flow: row-reverse nowrap;

  &--maximized {
    .titlebar__drag {
      inset: 0;
    }
  }

  &__drag {
    position: absolute;
    inset: 4px 4px 0 4px;
    -webkit-app-region: drag;
  }

  &__content {
    position: relative;
    display: flex;
    color: r.$col-200;
  }

  &__avatar {
    height: 100%;
    padding: 0 5px;
  }
  &__search {
    margin: 0 6px;
    width: 300px;
  }

  &__controls {
    display: flex;
    align-items: center;
    padding-right: 10px;

    .popper-target {
      height: 100%;
    }

    & > * {
      -webkit-app-region: no-drag;
    }
  }

  &__window-controls {
    display: flex;
  }

  &__control {
    @include r.buttonReset;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 1rem;

    width: 50px;
    background: r.$col-900;

    transition: background .1s, color .1s;

    -webkit-app-region: no-drag;

    &:hover {
      background: r.$col-800;
      color: r.$col-white;

      &:active {
        background: r.$col-600;
      }
    }

    &--danger {
      &:hover {
        background: r.$col-danger;

        &:active {
          background: color.adjust(r.$col-danger, $lightness: 5%);
        }
      }
    }
  }
}
</style>
