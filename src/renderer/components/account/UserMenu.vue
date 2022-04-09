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

export default defineComponent({
  setup () {
    const userState = useUserState()

    function signOut () {
      getAuth().signOut()

      console.log('%c[Authentication]', 'color: #e846fa', 'User signed out')
    }

    // Send email verification
    function verifyEmail () {
      if (getAuth().currentUser) {
        reload(getAuth().currentUser!).then(() => {
          if (!getAuth().currentUser?.emailVerified) {
            sendEmailVerification(getAuth().currentUser!)
              .then(() => {
                console.log('%c[Authentication]', 'color: #e846fa', 'Sent email verification')
              }).catch((error) => {
                console.error('%c[Authentication]', 'color: #e846fa', 'Failed to send email verification:', error)
              })
          } else {
            console.log('%c[Authentication]', 'color: #e846fa', 'Email is already verified')
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
