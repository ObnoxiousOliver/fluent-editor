import { Mark } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    strike: {
      setStrike: (color: string | null, thickness: string | null, style: string | null) => ReturnType
      unsetStrike: () => ReturnType
      toggleStrike: () => ReturnType
    }
  }
}

export const Strike = Mark.create({
  name: 'strike',

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
        tag: 's',
        getAttrs (element) {
          const style = (element as HTMLElement).style
          return {
            color: style.textDecorationColor ?? null,
            thickness: (style as any).textDecorationThickness ?? null,
            style: style.textDecorationStyle ?? null
          }
        }
      },
      { tag: 'del' },
      { tag: 'strike' },
      {
        style: 'text-decoration',
        consuming: false,
        getAttrs: style => ((style as string).includes('line-through') ? {} : false)
      }
    ]
  },

  renderHTML ({ HTMLAttributes }) {
    return ['s', {
      style: [
        HTMLAttributes.color && 'text-decoration-color: ' + HTMLAttributes.color,
        HTMLAttributes.thickness && 'text-decoration-thickness: ' + HTMLAttributes.thickness,
        HTMLAttributes.style && 'text-decoration-style: ' + HTMLAttributes.style
      ].filter(x => x).join(';')
    }, 0]
  },

  addCommands () {
    return {
      setStrike: (color = null, thickness = null, style = null) => ({ commands }) => {
        return commands.setMark(this.name, { color, thickness, style })
      },
      unsetStrike: () => ({ commands }) => {
        return commands.unsetMark(this.name)
      },
      toggleStrike: () => ({ commands }) => {
        return commands.toggleMark(this.name)
      }
    }
  },

  addKeyboardShortcuts () {
    return {
      'Mod-y': () => {
        this.editor.commands.setTextColor('#d85555')
        this.editor.commands.setFontFamily('Oswald, sans-serif')
        this.editor.commands.setLetterSpacing('0.1em')
        this.editor.commands.setFontSize(200)
        // return this.editor.commands.setLineHeight('200px')
        return this.editor.commands.setUnderline('#f00', null, 'dotted')
      }
    }
  }
})
