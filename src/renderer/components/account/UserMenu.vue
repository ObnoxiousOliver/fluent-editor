<template>
  {{ user.displayName }}<br>
  <button
    @click="signOut"
    class="sign-out"
  >
    Sign out
  </button>
</template>

<script lang="ts">
import { getAuth } from '@firebase/auth'
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  props: {
    user: Object
  },

  setup () {
    const router = useRouter()

    async function signOut () {
      await getAuth().signOut()
      router.push('auth/login')
    }

    return {
      signOut
    }
  }
})
</script>
