// Create Pinia store
import { User } from 'firebase/auth'
import { defineStore } from 'pinia'

export const useUserState = defineStore('userState', {
  state: () => ({
    user: null as User | null,
    displayName: null as string | null,
    isLoggedIn: false
  })
})