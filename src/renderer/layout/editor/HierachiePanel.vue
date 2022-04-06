<template>
  <ScrollViewer class="hierachie">
    <pre>{{ JSON.stringify(editor_, null, 1) }}</pre>
  </ScrollViewer>
</template>

<script lang="ts">
import ScrollViewer from '@/renderer/components/scrollViewer/ScrollViewer.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { ScrollViewer },
  props: {
    editor: Object
  },

  setup (props, { emit }) {
    const editor_ = ref(props.editor)

    return {
      editor_
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.hierachie {
  @include r.light {
    background: r.$col-white;
  }
  @include r.dark {
    background: r.$col-700;
  }
}
</style>
