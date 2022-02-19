<template>
  <component
    :is="item.type + '-item'"
    :item="item.value"
  />
</template>

<script lang="ts">
// import { PanelContentItemTypes } from '@/renderer/models/nodes/properties/PanelContentItemTypes'
import VerticalGroup from './items/VerticalGroup.vue'
import NumberItem from './items/NumberItem.vue'
import LabelItem from './items/LabelItem.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: {
    'vertical-group-item': VerticalGroup,
    'number-item': NumberItem,
    'label-item': LabelItem
  },

  props: {
    item: Object
  }
})
</script>
