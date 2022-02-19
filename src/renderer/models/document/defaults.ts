import { Fill } from '../vector/Fill'
import DocumentSize from './DocumentSize'

export default function defaults () {
  return {
    document: {
      size: {
        width: 1280,
        height: 720
      } as DocumentSize
    },
    slide: {
      fill: '#ffffff' as Fill
    },
    node: {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    },
    textNode: {
      width: null,
      height: null,

      color: '#000',
      fontFamily: ['Roboto', 'sans-serif'],
      fontSize: 24,
      paragraphSpacing: 16
    }
  }
}
