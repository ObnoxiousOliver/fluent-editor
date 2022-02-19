<template>
  <div class="properties-accordion">
    <PropertiesAccordionItem
      v-for="(prop, i) in sortedProperties"
      :key="i"
      :item="prop"
      :editor="editor"
    />
  </div>
</template>

<script lang="ts">
import { Panel } from '@/renderer/models/nodes/properties/Properties'
import { computed, defineComponent } from 'vue'
import PropertiesAccordionItem from './PropertiesAccordionItem.vue'

export default defineComponent({
  components: { PropertiesAccordionItem },
  props: {
    properties: Array,
    editor: Object
  },

  setup (props) {
    const sortedProperties = computed(() => (props.properties as Panel[]).sort((a, b) => a.order - b.order))

    return {
      sortedProperties
    }
  }
})
</script>
