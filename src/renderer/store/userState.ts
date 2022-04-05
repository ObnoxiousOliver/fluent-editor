// Create Pinia store
import { defineStore } from 'pinia'

export const useUserState = defineStore('userState', {
  state: () => ({
    isLoggedIn: false
  })
})
