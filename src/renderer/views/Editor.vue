<template>
  <div class="view-editor">
    <EditorView
      :id="docId"
      v-model:project="project"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, watch } from 'vue'
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

    var timeout: number | null = null
    watch(project, () => {
      if (!loaded) return

      if (timeout) {
        clearTimeout(timeout)
      }

      timeout = setTimeout(() => {
        // Sync project to firestore
        setProject(docId, project.value)

        timeout = null
      }, 5000)
    }, { deep: true })

    onBeforeUnmount(() => {
      setProject(docId, project.value)
    })

    project.value = await getProject(docId)

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
