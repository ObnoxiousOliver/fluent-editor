import RegistedElement from './RegistedElement'

export default interface ElementStoreInstance {
  registeredElements: {
    [x: string]: RegistedElement
  },
  hovering: string[],
  toolData: any
}
