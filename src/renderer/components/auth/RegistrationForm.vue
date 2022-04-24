<template>
  <form
    @submit.prevent="register"
    class="form"
  >
    <div class="form__text">
      {{ $t('auth.register.loginLinkText') }}

      <router-link
        class="form__link"
        :to="{ params: { action: 'login' } }"
      >
        {{ $t('auth.register.loginLink') }}
      </router-link>
    </div>

    <div class="form__inputs">
      <fieldset :disabled="suspend">
        <div class="form__input-group form__input-group--display-name">
          <FloatingLabelField
            v-model="displayName"
            :label="$t('auth.displayName')"
            type="text"
          />
        </div>
        <div class="form__input-group form__input-group--email">
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
          <FloatingLabelField
            v-model="confirmPassword"
            :label="$t('auth.register.confirmPassword')"
            type="password"
            autocomplete="on"
          />
        </div>

        <div class="form__input-group form__input-group--submit">
          <SubmitButton>
            {{ $t('auth.register.button') }}
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
import { getAuth, onAuthStateChanged } from '@firebase/auth'
import { createAccountWithEmailPasswordAndName } from '@/renderer/firebase/auth'
import { defineComponent, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FloatingLabelField from '../FloatingLabelField.vue'
import SubmitButton from './SubmitButton.vue'

export default defineComponent({
  components: { FloatingLabelField, SubmitButton },
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

      createAccountWithEmailPasswordAndName(email.value, password.value, displayName.value)
        .then(() => {
          // Redirect to the home page
          router.push(route.query.redirect as string || { name: 'home' })
        }).catch((err) => {
          switch (err.code) {
            case 'auth/invalid-email':
              break

            case 'auth/email-already-in-use':
              break

            case 'auth/weak-password':
              break

            default:
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

<style lang="scss" scoped>
@use '../../scss/form';

.form {
  &__inputs fieldset {
    gap: 20px;
  }

  &__input-group {
    &--password {
      .floating-label-field:first-child {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
