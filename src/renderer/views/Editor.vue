<template>
  <div class="view-editor">
    id: {{ docId }}

    {{ project }}

    <EditorView :tabId="editorStore.tabs[0].id" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProject, setProject } from '../firebase/firestore'
import EditorView from '../layout/editor/EditorView.vue'
import { useEditor } from '../store'

export default defineComponent({
  components: { EditorView },
  async setup () {
    const route = useRoute()
    const docId = route.params.id as string

    var loaded = false

    const project = ref(null as any | null)
    watch(project, () => {
      if (!loaded) return

      // TODO: Add an 5sec interval to make autosave not so expensive
      setProject(docId, project.value)
    }, { deep: true })

    project.value = await getProject(docId)

    // TODO: Remove this
    setTimeout(() => {
      project.value.name = 'new name ' + Math.round(Math.random() * 1000)
    }, 2000)

    loaded = true

    const editorStore = useEditor()

    return {
      docId,
      project,
      editorStore
    }
  }
})
</script>

<style lang="scss" scoped>
.view-editor {
  height: 100%;
}

.editor {
  height: 100%;
}
</style>
