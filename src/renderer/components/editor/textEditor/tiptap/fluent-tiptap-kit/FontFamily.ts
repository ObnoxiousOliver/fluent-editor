import { Mark } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontFamily: {
      setFontFamily: (fontFamily: string) => ReturnType
      unsetFontFamily: () => ReturnType
    }
  }
}

export const FontFamily = Mark.create({
  name: 'fontFamily',

  addAttributes () {
    return {
      fontFamily: null
    }
  },

  parseHTML () {
    return [
      {
        style: 'font-family',
        getAttrs: value => ({ fontFamily: value })
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['span', {
      style: `font-family: ${HTMLAttributes.fontFamily}`
    }, 0]
  },

  addCommands () {
    return {
      setFontFamily: (fontFamily) => ({ commands }) => {
        return commands.setMark(this.name, { fontFamily })
      },
      unsetFontFamily: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      }
    }
  }
})
