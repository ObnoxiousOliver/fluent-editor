<template>
  <div class="view-home">
    <router-link
      v-for="project in userData.projects"
      :key="project.id + '_' + project.name"
      :to="{
        name: 'editor',
        params: {
          id: project.id ?? 0
        }
      }"
    >
      {{ project.name ?? 'Untitled' }}<br>
    </router-link>

    <button @click="createProjectBtn">
      Create Project
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUserData } from '../store'
import { createProject } from '../project/manage'

export default defineComponent({
  setup () {
    const userData = useUserData()

    function createProjectBtn () {
      createProject()
    }

    return {
      userData,
      createProjectBtn
    }
  }
})
</script>
