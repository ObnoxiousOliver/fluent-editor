<template>
  <div
    id="layer"
    class="app-layer"
  />
  <div class="app-layout">
    <Titlebar class="app-layout__titlebar" />
    <!-- <AppMenu class="app-layout__app-menu" /> -->
    <div class="app-layout__content">
      <slot />
    </div>
  </div>

  <!-- <transition name="fade">
    <div
      v-if="isBrowser && (docRect?.width < 800 || docRect?.height < 400)"
      class="small-window-warning"
    >
      <div class="small-window-warning__content">
        <p class="small-window-warning__icon">
          <bi i="aspect-ratio" /> !
        </p>
        <p class="small-window-warning__title">
          {{ $t('smallWindowWarning.title') }}
        </p>
        <p  class="small-window-warning__detail">
          {{ $t('smallWindowWarning.detail', [800, 400]) }}
        </p>
      </div>
    </div>
  </transition> -->
</template>

<script>
import Titlebar from '../components/titlebar/Titlebar.vue'
// import AppMenu from '../components/appMenu/AppMenu.vue'

import { isBrowser } from '../utils/browser'
import { onBeforeUnmount, onMounted, ref } from '@vue/runtime-core'

export default {
  components: {
    Titlebar
    // AppMenu
  },
  setup () {
    const docRect = ref()

    onMounted(() => {
      const observer = new ResizeObserver(() => {
        docRect.value = document.body.getBoundingClientRect()
      })
      observer.observe(document.body)

      onBeforeUnmount(() => {
        observer.unobserve(document.body)
        observer.disconnect()
      })
    })

    return {
      isBrowser,
      docRect
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.app-layout {
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;

  &__content {
    height: 100%;
  }

  @include r.light {
    background: r.$col-100;
  }
  @include r.dark {
    background: r.$col-800;
  }
}

.app-layer {
  z-index: 9999;
  position: absolute;
}

.small-window-warning {
  z-index: 9999;
  position: fixed;
  inset: 0;
  background: #000d;

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background: #000b;
    backdrop-filter: blur(10px);
  }

  color: white;
  font-size: 1.2rem;

  text-align: center;
  padding: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    max-width: 400px;
  }

  &__icon {
    font-size: 4rem;
    color: r.$col-danger;
    margin-bottom: -.9rem;
  }

  &__title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  &__detail {
    color: r.$col-200;
  }
}
</style>
