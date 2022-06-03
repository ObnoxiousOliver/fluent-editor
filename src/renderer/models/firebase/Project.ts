
export interface ProjectRef {
  id: string
  name: string | null
}

export interface Project {
  uid: string
  projectVersion: number
  name: string | null,
  document: string
}
