<template>
  <form
    v-show="!suspend"
    @submit.prevent="signIn"
    class="login-form"
  >
    <router-link :to="{ params: { action: 'register' } }">
      Register
    </router-link>

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

    // Wait for the auth state to be ready
    const suspend = ref(true)

    onMounted(() => {
      // Listen for auth state changes
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          router.push(route.query.redirect as string ?? { name: 'home' })
        }
        suspend.value = false
      })
    })

    // Sign in with email and password
    function signIn () {
      suspend.value = true

      signInWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((userCredentials) => {
          console.log('%c[Authentication]', 'color: #e846fa', 'Signed in as:', userCredentials.user.email)

          // Redirect to the home page
          router.push(route.query.redirect as string || { name: 'home' })
        }).catch((err) => {
          switch (err.code) {
            case 'auth/user-not-found':
              console.error('%c[Authentication]', 'color: #e846fa', 'User not found')
              break

            case 'auth/wrong-password':
              console.error('%c[Authentication]', 'color: #e846fa', 'Wrong password')
              break

            case 'auth/invalid-email':
              console.error('%c[Authentication]', 'color: #e846fa', 'Invalid email')
              break

            default:
              console.error('%c[Authentication]', 'color: #e846fa', 'Error:', err)
              break
          }
        }).finally(() => {
          suspend.value = false
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
