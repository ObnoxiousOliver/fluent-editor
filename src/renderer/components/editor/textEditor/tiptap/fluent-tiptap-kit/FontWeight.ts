import { Mark } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontWeight: {
      setBold: () => ReturnType
      toggleBold: () => ReturnType
      setFontWeight: (fontWeight: number) => ReturnType
      unsetFontWeight: () => ReturnType
    }
  }
}

export const FontWeight = Mark.create({
  name: 'fontWeight',

  addAttributes () {
    return {
      fontWeight: null
    }
  },

  parseHTML () {
    return [
      { tag: 'strong' },
      { tag: 'b' },
      {
        style: 'font-weight',
        getAttrs: value => {
          if (value && (value === 'normal' || +value === 400)) {
            return false
          }

          const mappings = {
            light: 200,
            bold: 700,
            bolder: 900
          } as { [x: string]: number }

          const fontWeight = mappings[value as string] ?? +value

          if (!fontWeight) return false

          return { fontWeight }
        }
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['span', {
      style: `font-weight: ${HTMLAttributes.fontWeight}`
    }, 0]
  },

  addCommands () {
    return {
      setBold: () => ({ commands }) => {
        return commands.setMark(this.name, {
          fontWeight: 700
        })
      },
      toggleBold: () => ({ commands }) => {
        return commands.toggleMark(this.name, {
          fontWeight: 700
        })
      },
      setFontWeight: (fontWeight) => ({ commands }) => {
        return commands.setMark(this.name, { fontWeight })
      },
      unsetFontWeight: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      }
    }
  }
})
