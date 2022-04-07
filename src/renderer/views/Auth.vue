<template>
  <div class="view-auth">
    <LoginForm v-if="$route.params.action === 'login'" />
    <RegistrationForm v-else-if="$route.params.action === 'register'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import LoginForm from '../components/auth/LoginForm.vue'
import RegistrationForm from '../components/auth/RegistrationForm.vue'

export default defineComponent({
  components: {
    LoginForm,
    RegistrationForm

  },

  setup () {

  }
})
</script>
