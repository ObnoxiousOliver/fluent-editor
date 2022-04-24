import { defineStore } from 'pinia'
import { ProjectRef } from '../models/firebase/Project'

export const useUserData = defineStore('userData', {
  state: () => ({
    loaded: false,
    projects: [] as ProjectRef[]
  })
})
