import { Mark } from '@tiptap/vue-3'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    liga: {
      setNoLiga: () => ReturnType
      unsetNoLiga: () => ReturnType
    }
  }
}

export default Mark.create({
  name: 'noliga',

  parseHTML () {
    return [
      {
        style: 'font-variant-ligatures',
        getAttrs: value => value !== 'normal' && null
      }
    ]
  },

  renderHTML () {
    return ['span', { style: 'font-variant-ligatures: none' }, 0]
  },

  addCommands () {
    return {
      setNoLiga: () => (chain: any) => {
        return chain.commands.setMark(this.name)
      },
      unsetNoLiga: () => (chain: any) => {
        return chain.commands.unsetMark(this.name)
      }
    }
  }
})
