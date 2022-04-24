<template>
  <div class="view-editor">
    id: {{ docId }}

    {{ project }}
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getProject, setProject } from '../firebase/firestore'

export default defineComponent({
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

    return {
      docId,
      project
    }
  }
})
</script>
