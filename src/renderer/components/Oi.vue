<template>
  <svg
    v-if="icon"
    :viewBox="[0, 0, icon.w, icon.h].join(' ')"
    :width="icon.w / 16 + 'em'"
    :height="icon.h / 16 + 'em'"
  >
    <path
      :d="icon.d"
      fill="currentColor"
    />
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import obnixIcons from '../assets/icons/obnixIcons'

export default defineComponent({
  props: {
    i: String
  },
  setup (props) {
    const icon = computed(() => props.i && (obnixIcons as any)[props.i])

    return {
      icon
    }
  }
})
</script>

<style lang="scss" scoped>
svg {
  display: inline;
}
</style>
