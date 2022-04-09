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
import { getAuth, reload, sendEmailVerification } from '@firebase/auth'
import { defineComponent } from 'vue'
import { errorSendEmailVerification, logEmailAlreadyVerified, logSendEmailVerification, logSignOut } from '@/renderer/firebase/logging'

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
        reload(auth.currentUser!).then(() => {
          if (!auth.currentUser?.emailVerified) {
            sendEmailVerification(auth.currentUser!)
              .then(() => {
                logSendEmailVerification(auth.currentUser?.email!)
              }).catch((err) => {
                errorSendEmailVerification(err)
              })
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
