<template>
  <teleport to="#layer">
    <div
      :style="{
        top: y + 'px',
        left: x + 'px'
      }"
      class="app-submenu"
    >
      <AppSubmenuButton
        v-for="item in menu"
        :key="item.id"

        @mouseenter="mouseenter(item.id)"

        :item="item"
        :focused="menu?.filter(x => x.role !== 'divider')[focus?.[0]].id === item.id"
      />
    </div>
  </teleport>
</template>

<script lang="ts">
import AppMenuItem from '@/renderer/models/appMenu/AppMenuItem'
import { defineComponent } from 'vue'
import AppSubmenuButton from './AppSubmenuButton.vue'

export default defineComponent({
  components: { AppSubmenuButton },
  emits: [
    'setFocus'
  ],
  props: {
    focus: Array,
    menu: Object,
    x: Number,
    y: Number
  },

  setup (props, { emit }) {
    function mouseenter (id: string) {
      var i = props.menu
        ?.filter((x: AppMenuItem) => x.role !== 'divider')
        .findIndex((x: AppMenuItem) => x.id === id)

      if (i !== -1) {
        emit('setFocus', [i])
      }
    }

    return {
      mouseenter
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.app-submenu {
  position: absolute;
  width: 250px;
  padding: 5px 0;

  @include r.dark {
    background: r.$col-700;
    color: r.$col-100;
  }
  @include r.light {
    background: r.$col-white;
    color: r.$col-500;
  }

  font-size: 14px;

  box-shadow: r.$shadow-low;
}
</style>
