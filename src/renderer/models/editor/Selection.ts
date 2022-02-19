export default interface Selection {
  selection: string[],
  editing: string | null
}

export function createSelection () : Selection {
  return {
    selection: [],
    editing: null
  }
}
