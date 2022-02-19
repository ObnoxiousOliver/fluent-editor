import DefComponent from '@/renderer/models/svg/DefComponent'
import DefParser from '@/renderer/models/svg/DefParser'
import Gradient, { Stop } from '@/renderer/models/vector/Gradient'

export default {
  types: [
    'fill',
    'stroke'
  ],
  parse (def: any, id: string, key: string) {
    const GRADIENT: Gradient | null = typeof (def) === 'string' ? null : def

    // console.log(def)

    const ID = id + `_paint_${key}`

    return !GRADIENT
      ? {
        elementAttributes: {
          [key]: def
        }
      }
      : {
        tag: ({
          radial: 'radialGradient',
          linear: 'linearGradient'
        } as any)[(def as Gradient).type],
        attributes: {
          id: ID,
          ...((GRADIENT.type === 'linear' && {
            x1: GRADIENT.x1 * 100 + '%',
            y1: GRADIENT.y1 * 100 + '%',
            x2: GRADIENT.x2 * 100 + '%',
            y2: GRADIENT.y2 * 100 + '%'
          }) ?? {}),

          ...(((def as Gradient).type === 'radial' && {
          }) ?? {})
        },
        children: (def as Gradient).stops?.map((x: Stop) => ({
          tag: 'stop',
          attributes: {
            offset: (x.offset as number) * 100 + '%',
            'stop-color': x.color
          }
        })),
        elementAttributes: {
          [key]: `url(#${ID})`
        }
      } as DefComponent
  }
} as DefParser
