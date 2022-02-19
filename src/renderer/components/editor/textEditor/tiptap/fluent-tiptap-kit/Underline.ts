import { Mark } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    underline: {
      setUnderline: (color: string | null, thickness: string | null, style: string | null) => ReturnType
      unsetUnderline: () => ReturnType
      toggleUnderline: () => ReturnType
    }
  }
}

export const Underline = Mark.create({
  name: 'underline',

  addAttributes () {
    return {
      color: null,
      thickness: null,
      style: null
    }
  },

  parseHTML () {
    return [
      {
        tag: 'u',
        getAttrs (element) {
          const style = (element as HTMLElement).style
          return {
            color: style.textDecorationColor ?? null,
            thickness: (style as any).textDecorationThickness ?? null,
            style: style.textDecorationStyle ?? null
          }
        }
      },
      {
        style: 'text-decoration',
        consuming: false,
        getAttrs: style => ((style as string).includes('underline') ? {} : false)
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['u', {
      style: [
        HTMLAttributes.color && 'text-decoration-color: ' + HTMLAttributes.color,
        HTMLAttributes.thickness && 'text-decoration-thickness: ' + HTMLAttributes.thickness,
        HTMLAttributes.style && 'text-decoration-style: ' + HTMLAttributes.style
      ].filter(x => x).join(';')
    }, 0]
  },

  addCommands () {
    return {
      setUnderline: (color = null, thickness = null, style = null) => ({ commands }) => {
        return commands.setMark(this.name, { color, thickness, style })
      },
      unsetUnderline: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
      toggleUnderline: (color = null, thickness = null, style = null) => ({ commands }) => {
        return commands.toggleMark(this.name, { color, thickness, style })
      }
    }
  }
})
