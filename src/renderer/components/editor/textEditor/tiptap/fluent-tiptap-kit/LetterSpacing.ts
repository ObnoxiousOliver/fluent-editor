import { Mark } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    letterSpacing: {
      setLetterSpacing: (letterSpacing: string) => ReturnType
      unsetLetterSpacing: () => ReturnType
    }
  }
}

export const LetterSpacing = Mark.create({
  name: 'letterSpacing',

  addAttributes () {
    return {
      letterSpacing: null
    }
  },

  parseHTML () {
    return [
      {
        style: 'letter-spacing',
        getAttrs: value => ({ letterSpacing: value })
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['span', {
      style: `letter-spacing: ${HTMLAttributes.letterSpacing}; padding-inline-start: ${HTMLAttributes.letterSpacing}`
    }, 0]
  },

  addCommands () {
    return {
      setLetterSpacing: (letterSpacing) => ({ commands }) => {
        return commands.setMark(this.name, { letterSpacing })
      },
      unsetLetterSpacing: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      }
    }
  }
})
