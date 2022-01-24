<template>
  <div
    id="layer"
    class="app-layer"
  />
  <div class="app-layout">
    <Titlebar class="app-layout__titlebar" />
    <AppMenu class="app-layout__app-menu" />
    <div class="app-layout__content">
      <slot />
    </div>
  </div>
</template>

<script>
import Titlebar from './Titlebar.vue'
import AppMenu from '../components/appMenu/AppMenu.vue'

export default {
  components: {
    Titlebar,
    AppMenu
  }
}
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;

  &__content {
    height: 100%;
  }
}

.app-layer {
  z-index: 9999;
  position: absolute;
}
</style>
