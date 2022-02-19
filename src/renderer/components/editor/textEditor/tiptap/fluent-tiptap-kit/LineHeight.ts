import { Mark } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType
      unsetLineHeight: () => ReturnType
    }
  }
}

export const LineHeight = Mark.create({
  name: 'lineHeight',

  addOptions () {
    return {
      types: []
    }
  },

  addGlobalAttributes () {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: element => element.style.lineHeight || null,
            renderHTML: attributes => ({ style: `line-height: ${attributes.lineHeight}` })
          }
        }
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['span', {
      style: `line-height: ${HTMLAttributes.lineHeight}`
    }, 0]
  },

  addCommands () {
    return {
      setLineHeight: (lineHeight) => ({ commands }) => {
        return this.options.types.every((type: string) => commands.updateAttributes(type, { lineHeight }))
      },
      unsetLineHeight: () => ({ commands }) => {
        return this.options.types.every((type: string) => commands.resetAttributes(type, 'lineHeight'))
      }
    }
  }
})
