import { Timestamp } from 'firebase/firestore'

export interface ProjectRef {
  id: string
  name?: String
  createdAt?: Timestamp
  lastUpdatedAt?: Timestamp
}

export interface Project {
  name?: String
  uid: string
}
