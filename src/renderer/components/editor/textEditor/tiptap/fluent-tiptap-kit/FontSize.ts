import { Mark } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (fontSize: number) => ReturnType
      unsetFontSize: () => ReturnType
    }
  }
}

export const FontSize = Mark.create({
  name: 'fontSize',

  addAttributes () {
    return {
      fontSize: null
    }
  },

  parseHTML () {
    return [
      {
        style: 'font-size',
        getAttrs: value => {
          if (!/\d+px/.test(value as string)) {
            return false
          }

          return { fontSize: +(value as string).replace('px', '') }
        }
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['span', {
      style: `font-size: ${HTMLAttributes.fontSize}px`
    }, 0]
  },

  addCommands () {
    return {
      setFontSize: (fontSize) => ({ commands }) => {
        return commands.setMark(this.name, { fontSize })
      },
      unsetFontSize: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      }
    }
  }
})
