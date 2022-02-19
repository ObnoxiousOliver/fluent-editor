import { Mark } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    textColor: {
      setTextColor: (textColor: string) => ReturnType
      unsetTextColor: () => ReturnType
    }
  }
}

export const TextColor = Mark.create({
  name: 'textColor',

  addAttributes () {
    return {
      textColor: null
    }
  },

  parseHTML () {
    return [
      {
        style: 'color',
        getAttrs: value => {
          if (!/#([a-fA-F0-9]{8}|[a-fA-F0-9]{6}|[a-fA-F0-9]{3,4})/.test(value as string)) {
            return false
          }

          return { textColor: value as string }
        }
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['span', {
      style: `color: ${HTMLAttributes.textColor}`
    }, 0]
  },

  addCommands () {
    return {
      setTextColor: (textColor) => ({ commands }) => {
        return commands.setMark(this.name, { textColor })
      },
      unsetTextColor: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      }
    }
  }
})
