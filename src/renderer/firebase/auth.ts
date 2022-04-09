import { getAuth, reload } from 'firebase/auth'
import { errorReload, logReload } from './logging'

const auth = getAuth()

export async function reloadUser () {
  if (auth.currentUser) {
    try {
      await reload(auth.currentUser)
      logReload()
    } catch (err) {
      errorReload(err)
    }
  }
}
