export default interface Selection {
  selection: string[],
  hovering: string[]
}

export function createSelection () : Selection {
  return {
    selection: [],
    hovering: []
  }
}
