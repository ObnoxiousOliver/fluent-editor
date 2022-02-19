import randomId from '@/renderer/utils/randomId'
import Node from '../nodes/Node'
import { Fill } from '../vector/Fill'
import defaults from './defaults'

export interface Slide {
  id: string
  name: string | null
  fill: Fill,
  // root: Frame
  children: Node[]
}

export function createSlide (name?: string | null, id?: string, fill?: Fill) : Slide {
  return {
    id: id ?? randomId(),
    name: name ?? null,
    fill: fill ?? defaults().slide.fill,
    // root: new Frame()
    children: []
  }
}
