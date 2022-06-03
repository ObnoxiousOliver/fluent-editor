import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc } from 'firebase/firestore'
import { auth, db } from '.'
import { Project, ProjectRef } from '../models/firebase/Project'
import { useUserData } from '../store'
import debug, { Log } from '../utils/debug'

export const collections = {
  users: collection(db, 'users'),
  projects: collection(db, 'projects')
}

export function getUserRef () {
  if (!auth.currentUser) {
    throw new Error('User is not logged in')
  }

  return doc(collections.users, auth.currentUser.uid)
}

export async function setUid () {
  try {
    const userRef = getUserRef()
    console.log('userRef', userRef)
    const uid = auth.currentUser!.uid

    let isUidSet = false

    try {
      // if this ever fails, it means the user already has a uid
      // if not and uids don't match, something is VERY wrong
      isUidSet = (await getDoc(userRef)).data()?.uid !== uid
    } catch {}

    if (!isUidSet) {
      await setDoc(userRef, { uid }, { merge: true })
    }
  } catch (err) {
    debug.error(Log.firestore, err)
  }
}

export async function setCreationDate () {
  try {
    await setUid()

    await setDoc(getUserRef(), {
      createdAt: serverTimestamp()
    }, { merge: true })
  } catch (err) {
    debug.error(Log.firestore, err)
  }
}

export function subscribeToUserDocumentChanges (): Function {
  return onSnapshot(getUserRef(), (snapshot) => {
    const userData = useUserData()
    const user = snapshot.data()

    userData.loaded = true
    userData.projects = user?.projects?.map((p: any): ProjectRef => ({
      id: p?.id,
      name: p?.name ?? null
    }))

    debug.log(Log.firestore, 'User document changed', snapshot)
  })
}

export async function getProject (id: string): Promise<Project> {
  return (await getDoc(doc(collections.projects, id))).data() as Project
}

export async function setProject (id: string | null, project: Project) {
  const docRef = id
    ? doc(collections.projects, id)
    : doc(collections.projects)

  await setDoc(docRef, {
    ...project,
    uid: auth.currentUser?.uid
  })
  return docRef
}
