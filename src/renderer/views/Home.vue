<template>
  <div class="view-home">
    <router-link
      v-for="project in userData.projects"
      :key="project.id"
      :to="{
        name: 'editor',
        params: {
          id: project.id
        }
      }"
    >
      {{ project.name }}
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUserData } from '../store'

export default defineComponent({
  setup () {
    const userData = useUserData()

    return {
      userData
    }
  }
})
</script>
