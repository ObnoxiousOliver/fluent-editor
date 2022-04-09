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
import { logEmailAlreadyVerified, logSignOut } from '@/renderer/firebase/logging'
import { reloadUser, sendEmailVerification } from '@/renderer/firebase/auth'

export default defineComponent({
  setup () {
    const userState = useUserState()

    const auth = getAuth()

    function signOut () {
      auth.signOut()

      logSignOut()
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
