<template>
  <!-- App Tab View Start -->
  <keep-alive ref="root">
    <component
      :is="$slots?.default().flatMap(x => x.children ? x.children : x)[tabindex]"
    />
  </keep-alive>
  <!-- App Tab View End -->
</template>

<script lang="ts">
import { ref } from '@vue/reactivity'
import { defineComponent, onMounted } from '@vue/runtime-core'

export default defineComponent({
  props: {
    tabindex: { type: Number, default: () => 0 }
  },
  setup () {
    const root = ref(null as HTMLElement | null)

    onMounted(() => {
      console.log(root)
    })

    return {
      root
    }
  }
})
</script>
