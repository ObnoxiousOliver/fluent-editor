<template>
  <form
    @submit.prevent="signIn"
    class="form"
  >
    <div class="form__text">
      {{ $t('auth.login.registerLinkText') }}

      <router-link
        class="form__link"
        :to="{ params: { action: 'register' } }"
      >
        {{ $t('auth.login.registerLink') }}
      </router-link>
    </div>

    <div class="form__inputs">
      <fieldset :disabled="suspend">
        <div class="form__input-group">
          <FloatingLabelField
            v-model="email"
            :label="$t('auth.email')"
            type="email"
          />
        </div>

        <div class="form__input-group form__input-group--password">
          <FloatingLabelField
            v-model="password"
            :label="$t('auth.password')"
            type="password"
            autocomplete="on"
          />
          <router-link
            class="form__forgot-password-link"
            to="#"
          >
            {{ $t('auth.login.forgotPassword') }}
          </router-link>
        </div>

        <div class="form__input-group form__input-group--submit">
          <SubmitButton>
            {{ $t('auth.login.button') }}
          </SubmitButton>
        </div>
      </fieldset>

      <LoadingSpinner
        class="form__spinner"
        v-if="suspend"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@firebase/auth'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { errorInvalidEmail, errorUnknown, errorUserNotFound, errorWrongPassword, logSignInAs } from '@/renderer/firebase/logging'
import FloatingLabelField from '../FloatingLabelField.vue'
import SubmitButton from './SubmitButton.vue'
import LoadingSpinner from '../LoadingSpinner.vue'

export default defineComponent({
  components: { FloatingLabelField, SubmitButton, LoadingSpinner },
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
          logSignInAs(userCredentials.user.email)

          // Redirect to the home page
          router.push(route.query.redirect as string || { name: 'home' })
        }).catch((err) => {
          switch (err.code) {
            case 'auth/user-not-found':
              errorUserNotFound()
              break

            case 'auth/wrong-password':
              errorWrongPassword()
              break

            case 'auth/invalid-email':
              errorInvalidEmail()
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
      email,
      password,
      suspend,
      signIn
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss/form';

.form {
  &__input-group {
    &--password {
      .floating-label-field {
        margin-bottom: 20px;
      }
    }
  }
}
</style>
