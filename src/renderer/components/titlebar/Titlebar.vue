<template>
  <div :class="['titlebar', { 'titlebar--maximized': isMaximized }]">
    <div
      v-if="!isBrowser"
      class="titlebar__drag"
    />
    <div class="titlebar__controls">
      <FluentInput
        class="titlebar__search dark"
        :placeholder="t('search.placeholder')"
      >
        <template #after>
          <bi i="search" />
        </template>
      </FluentInput>
      <div
        v-if="!isBrowser"
        class="titlebar__control__divider"
      />
      <div
        v-if="!isBrowser"
        class="titlebar__window-controls"
      >
        <div
          @click="minimize()"
          class="titlebar__control"
        >
          <svg
            width="12"
            height="12"
          >
            <path
              stroke="currentColor"
              d="M1 6.5 l10 0"
            />
          </svg>
        </div>
        <div
          @click="toggleMaximize()"
          class="titlebar__control"
        >
          <svg
            v-if="isMaximized"
            width="13"
            height="13"
          >
            <path
              fill="none"
              stroke="currentColor"
              d="M3.5 3.5 l0 -2 8 0 0 8 -2 0 M1.5 3.5 l8 0 0 8 -8 0Z"
            />
          </svg>
          <svg
            v-else
            width="12"
            height="12"
          >
            <path
              fill="none"
              stroke="currentColor"
              d="M1.5 1.5 l9 0 0 9 -9 0Z"
            />
          </svg>
        </div>
        <div
          @click="close()"
          class="titlebar__control titlebar__control--danger"
        >
          <svg
            width="12"
            height="12"
          >
            <path
              fill="currentColor"
              d="M11 1.576 L6.583 6 11 10.424 10.424 11 6 6.583 1.576 11 1 10.424 5.417 6 1 1.576 1.576 1 6 5.417 10.424 1Z"
            />
          </svg>
        </div>
      </div>
    </div>
    <TabButtons class="titlebar__tabs" />
  </div>
</template>

<script lang="ts">
import { isBrowser } from '@/renderer/utils/browser'
import { defineComponent, onMounted, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
// import saveIcon from '../assets/icons/save.svg'
import TabButtons from './TabButtons.vue'

declare var global: {
  electron: any
}

export default defineComponent({
  components: {
    TabButtons
  },

  setup (props) {
    const { t } = useI18n()

    const isMaximized = ref(false)

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
      // saveIcon,
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

  &__tabs {
    flex: 1 1 0;
    position: relative;
  }
  &__search {
    width: 250px;
    align-self: center;
    -webkit-app-region: no-drag;

    .isBrowser & {
      margin-right: 10px;
    }
  }

  &__controls {
    position: relative;
    display: flex;
    color: r.$col-200;
  }

  &__window-controls {
    display: flex;
  }

  &__control {
    @include r.buttonReset;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 1.5rem;

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

    &__divider {
      width: 1px;
      margin: 10px;
      background: r.$col-500;
    }
  }
}
</style>
