import randomId from '@/renderer/utils/randomId'
import Frame from '../nodes/Frame'
import { Fill } from '../vector/Fill'
import defaults from './defaults'

export interface Slide {
  id: string
  name: string | null
  background: Fill
  root: Frame
}

export function createSlide (name?: string | null, id?: string, background?: Fill) : Slide {
  return {
    id: id ?? randomId(),
    name: name ?? null,
    background: background ?? defaults().slide.background,
    root: new Frame()
  }
}
