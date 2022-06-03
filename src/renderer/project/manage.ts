import { arrayUnion, serverTimestamp, updateDoc } from 'firebase/firestore'
import { auth } from '../firebase'
import { getUserRef, setProject } from '../firebase/firestore'
import { createDocument } from '../models/document/FluentDocument'
import { Project, ProjectRef } from '../models/firebase/Project'

export async function createProject () {
  const project: Project = {
    projectVersion: 1,
    uid: auth.currentUser!.uid,
    name: null,
    document: JSON.stringify(createDocument())
  }

  const docRef = await setProject(null, project)

  updateDoc(getUserRef(), {
    projects: arrayUnion({
      id: docRef.id,
      name: null
    } as ProjectRef)
  })
}
