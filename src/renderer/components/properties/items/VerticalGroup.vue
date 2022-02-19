<template>
  <div class="vertical-group">
    <ProptertiesPanelItem
      v-for="(contentItem, i) in item.content"
      :key="i"
      :item="contentItem"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    item: Object
  },

  setup () {

  }
})
</script>

<style lang="scss" scoped>
.vertical-group {
  display: flex;
  gap: 10px;

  & > * {
    flex: 1 1 auto;
  }
}
</style>
