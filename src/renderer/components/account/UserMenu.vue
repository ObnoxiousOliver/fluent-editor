<template>
  {{ userState.displayName }}<br>
  <button
    @click="signOut"
    class="sign-out"
  >
    Sign out
  </button><br>
  <button
    :disabled="userState.emailVerified"
    @click="verifyEmail"
    class="sign-out"
  >
    Resend Email Verification
  </button>
</template>

<script lang="ts">
import { useUserState } from '@/renderer/store'
import { getAuth } from '@firebase/auth'
import { defineComponent } from 'vue'
import { logEmailAlreadyVerified } from '@/renderer/firebase/logging'
import { reloadUser, sendEmailVerification } from '@/renderer/firebase/auth'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup () {
    const userState = useUserState()

    const auth = getAuth()

    async function signOut () {
      await auth.signOut()

      // Redirect to the login page
      useRouter().push('/auth/login')
    }

    // Send email verification
    function verifyEmail () {
      if (auth.currentUser) {
        reloadUser().then(() => {
          if (!auth.currentUser?.emailVerified) {
            sendEmailVerification()
          } else {
            logEmailAlreadyVerified()
          }
        })
      }
    }

    return {
      userState,
      signOut,
      verifyEmail
    }
  }
})
</script>
