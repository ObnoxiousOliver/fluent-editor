<template>
  <div class="label-item">
    {{ $t(item.label) }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    item: Object
  }
})
</script>

<style lang="scss" scoped>
@use '../../../scss' as r;

.label-item {
  letter-spacing: 0.2em;
  margin: 10px 5px 0;
  text-transform: uppercase;

  @include r.light {
    color: r.$col-500;
  }
  @include r.dark {
    color: r.$col-200;
  }
}
</style>
