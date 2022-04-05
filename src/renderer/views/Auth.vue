<template>
  <div class="view-auth">
    Login

    <!-- Login Form -->
    <form
      v-if="!suspend"
      @submit.prevent="signIn"
      class="login-form"
    >
      <div class="login-form__input-group">
        <label
          class="login-form__label"
          for="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          class="login-form__input"
          v-model="email"
        >
      </div>
      <div class="login-form__input-group">
        <label
          class="login-form__label"
          for="password"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          class="login-form__input"
          autocomplete="on"
          v-model="password"
        >
      </div>
      <div class="login-form__input-group">
        <button
          class="login-form__button"
          type="submit"
        >
          Login
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const email = ref('')
    const password = ref('')

    const router = useRouter()
    const route = useRoute()

    const suspend = ref(true)

    onMounted(() => {
      onAuthStateChanged(getAuth(), async (user) => {
        if (user) {
          await router.push(route.query.redirect as string || { name: 'home' })
        }
        suspend.value = false
      })
    })

    function signIn () {
      signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((userCredentials) => {
          console.log('%c[Authentication]', 'color: #e846fa', 'Signed in as:', userCredentials.user.email)

          router.push(route.query.redirect as string || { name: 'home' })
        })
        .catch((err) => {
          console.error('%c[Authentication]', 'color: #e846fa', err.message)
        })
    }

    return {
      router,
      email,
      password,
      suspend,
      signIn
    }
  }
})
</script>
