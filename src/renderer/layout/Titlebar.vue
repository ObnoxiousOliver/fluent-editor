<template>
  <div :class="['titlebar', { 'titlebar--maximized': isMaximized }]">
    <div class="titlebar__drag" />
    <!-- <div class="titlebar__content">
      <div class="titlebar__brand">
        Fluent
      </div>
    </div> -->
    <div class="titlebar__controls">
      <!-- <div class="titlebar__app-controls">
        <button class="titlebar__control titlebar__control--play">
          <bi i="play" />
        </button>
        <button class="titlebar__control titlebar__control--save">
          <img
            :src="saveIcon"
            alt="save"
          >
        </button>
      </div>
      <div class="titlebar__control__divider" /> -->
      <FluentInput
        class="titlebar__search dark"
        :placeholder="t('search.placeholder')"
      >
        <template #after>
          <bi i="search" />
        </template>
      </FluentInput>
      <div class="titlebar__control__divider" />
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
    <TabButtons class="titlebar__tabs" />
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from '@vue/runtime-core'
import { useI18n } from 'vue-i18n'
import saveIcon from '../assets/icons/save.svg'
import TabButtons from '../components/titlebar/TabButtons.vue'

export default defineComponent({
  components: {
    TabButtons
  },

  setup (props) {
    const { t } = useI18n()

    const isMaximized = ref(false)

    onMounted(() => {
      global.electron.window.isMaximized(val => { isMaximized.value = val })
    })

    function close () {
      global.electron.window.close()
    }
    function toggleMaximize () {
      if (isMaximized.value) global.electron.window.unmaximize()
      else global.electron.window.maximize()
    }
    function minimize () {
      global.electron.window.minimize()
    }

    return {
      t,
      isMaximized,
      close,
      toggleMaximize,
      minimize,
      saveIcon
    }
  }
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use '../scss' as r;

.titlebar {
  position: relative;
  z-index: 9999;

  background: r.$col-600;
  color: r.$col-white;
  height: 40px;
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

  // &__content {
  //   position: relative;
  //   display: flex;
  // }

  // &__brand {
  //   text-align: center;
  //   padding: 0 1rem;
  //   font-size: 1.75rem;
  //   font-family: r.$type-brand;
  // }

  &__search {
    width: 250px;
    align-self: center;
    -webkit-app-region: no-drag;
  }

  &__controls {
    position: relative;
    display: flex;
    color: r.$col-200;
  }

  &__app-controls {
    display: flex;
    color: r.$col-white;

    .titlebar__control {
      width: 40px;
    }
  }

  &__control {
    @include r.buttonReset;

    display: flex;
    justify-content: center;
    align-items: center;

    font-size: 1.5rem;

    width: 50px;
    background: r.$col-600;

    transition: background .1s, color .1s;

    -webkit-app-region: no-drag;

    &:hover {
      background: r.$col-500;
      color: r.$col-white;

      &:active {
        background: r.$col-400;
      }
    }

    &--danger {
      &:hover {
        background: r.$col-danger;

        &:active {
          background: color.adjust(r.$col-danger, $lightness: 10%);
        }
      }
    }

    &--search {
      font-size: 1rem;
    }
    &--play {
      font-size: 1.5rem;
    }

    &__divider {
      width: 1px;
      margin: 10px;
      background: r.$col-500;
    }
  }
}
</style>
