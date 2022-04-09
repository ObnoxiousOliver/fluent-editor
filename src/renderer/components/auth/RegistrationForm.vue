<template>
  <form
    v-show="!suspend"
    @submit.prevent="register"
    class="login-form"
  >
    <router-link :to="{ params: { action: 'login' } }">
      Login
    </router-link>

    <div class="login-form__input-group">
      <label
        class="login-form__label"
        for="displayName"
      >
        Display Name
      </label>
      <input
        id="displayName"
        type="text"
        class="login-form__input"
        v-model="displayName"
      >
    </div>
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
      <label
        class="login-form__label"
        for="confirmPassword"
      >
        Confirm Password
      </label>
      <input
        id="confirmPassword"
        type="password"
        class="login-form__input"
        autocomplete="on"
        v-model="confirmPassword"
      >
    </div>
    <div class="login-form__input-group">
      <button
        class="login-form__button"
        type="submit"
      >
        Create
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { errorEmailAlreadyInUse, errorInvalidEmail, errorReload, errorSendEmailVerification, errorUnknown, errorUpdateProfile, errorWeakPassword, logReload, logSendEmailVerification, logSignInAs, logUpdateProfile } from '@/renderer/firebase/logging'
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, reload, sendEmailVerification, updateProfile } from '@firebase/auth'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const displayName = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')

    const router = useRouter()
    const route = useRoute()

    // Wait for the auth state to be ready
    const suspend = ref(true)

    onMounted(() => {
      // Listen for auth state changes
      onAuthStateChanged(getAuth(), (user) => {
        if (user) {
          router.push(route.query.redirect as string || { name: 'home' })
        }
        suspend.value = false
      })
    })

    // Create a new user
    function register () {
      if (!displayName.value.trim()) {
        return
      }

      // Check if the passwords match
      if (password.value !== confirmPassword.value) {
        return
      }

      suspend.value = true

      createUserWithEmailAndPassword(getAuth(), email.value, password.value)
        .then((userCredentials) => {
          logSignInAs(userCredentials.user.email)

          // Set Display Name
          updateProfile(userCredentials.user, { displayName: displayName.value.trim() })
            .then(() => {
              logUpdateProfile(userCredentials.user.displayName)
            })
            .catch((err) => {
              errorUpdateProfile(err)
            })
            .finally(() => {
              // Send email verification
              sendEmailVerification(userCredentials.user)
                .then(() => {
                  logSendEmailVerification(userCredentials.user.email)
                }).catch((err) => {
                  errorSendEmailVerification(err)
                }).finally(() => {
                  suspend.value = false

                  // Reload the page to update the UI
                  reload(userCredentials.user).then(() => {
                    logReload()
                  }).catch((err) => {
                    errorReload(err)
                  }).finally(() => {
                    // Redirect to the home page
                    router.push(route.query.redirect as string || { name: 'home' })
                  })
                })
            })
        }).catch((err) => {
          switch (err.code) {
            case 'auth/invalid-email':
              errorInvalidEmail()
              break

            case 'auth/email-already-in-use':
              errorEmailAlreadyInUse()
              break

            case 'auth/weak-password':
              errorWeakPassword()
              break

            default:
              errorUnknown(err)
              break
          }
        }).finally(() => {
          suspend.value = false
        })
    }

    return {
      router,
      displayName,
      email,
      password,
      confirmPassword,
      suspend,
      register
    }
  }
})
</script>
