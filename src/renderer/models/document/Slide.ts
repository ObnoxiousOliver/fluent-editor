import randomId from '@/renderer/utils/randomId'
import Frame from '../nodes/Frame'
import defaults from './defaults'

export interface Slide {
  id: string
  name: string
  background: string
  root: Frame
}

export function createSlide (name?: string, id?: string, background?: string) : Slide {
  return {
    id: id ?? randomId(),
    name: name ?? 'Slide',
    background: background ?? defaults().slide.background,
    root: new Frame()
  }
}
