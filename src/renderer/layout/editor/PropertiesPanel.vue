<template>
  <ScrollViewer class="properties-panel">
    <div class="properties-panel__content">
      <PropertiesAccordion
        :editor="editor_"
        :properties="computedProperties"
      />
    </div>
  </ScrollViewer>
</template>

<script lang="ts">
import PropertiesAccordion from '@/renderer/components/accordion/PropertiesAccordion.vue'
import ScrollViewer from '@/renderer/components/scrollViewer/ScrollViewer.vue'
import EditorInstance from '@/renderer/models/editor/EditorInstance'
import { nodeProps } from '@/renderer/models/nodes/Node'
import { Properties } from '@/renderer/models/nodes/properties/Properties'
import { useRuntime } from '@/renderer/store'
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  components: { PropertiesAccordion, ScrollViewer },
  props: {
    editor: Object
  },

  setup (props) {
    const editor_ = ref(props.editor as EditorInstance)
    const runtime = useRuntime()

    const elements = computed(() => editor_.value.state.selection.selection.map(x => runtime.tabs[editor_.value?.id ?? -1]?.registeredElements[x]))

    const computedProperties = computed(() => {
      const properties: Properties = []

      properties.push(...nodeProps(elements.value))

      return properties
    })

    return {
      editor_,
      runtime,
      elements,
      computedProperties
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.properties-panel {
  @include r.light {
    background: r.$col-white;
  }
  @include r.dark {
    background: r.$col-700;
  }

  &__content {
    padding: 10px 0;
  }
}
</style>
