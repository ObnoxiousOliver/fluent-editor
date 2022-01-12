import DocumentSize from './DocumentSize'

export interface Defaults {
  document: {
    size: DocumentSize
  },
  slide: {
    background: string
  },
  frame: {
    fill: string | null
  }
}

export default function defaults () : Defaults {
  return {
    document: {
      size: {
        width: 1280,
        height: 720
      }
    },
    slide: {
      background: '#ffffff'
    },
    frame: {
      fill: null
    }
  }
}
