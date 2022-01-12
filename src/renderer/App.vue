<template>
  <SlideRenderer />
  <button @click="createRect">Create Rect</button>
  <button @click="reset">Reset Doc</button>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import SlideRenderer from './components/document/SlideRenderer.vue'
import Frame from './models/nodes/Frame'
import { bufferDecode, bufferEncode } from './utils/bufferSerialization'

import { useEditor } from './store'
import Rect from './models/nodes/Rect'

export default defineComponent({
  name: 'App',
  components: {
    SlideRenderer
  },

  setup () {
    const editorStore = useEditor()

    // Sync document store with local storage
    try {
      editorStore.$patch(JSON.parse(localStorage.getItem('editorState') ?? ''))
    } catch {}

    editorStore.$subscribe((_, state) => {
      localStorage.setItem('editorState', JSON.stringify(state))
    })

    // Create Rect
    function createRect () : void {
      editorStore.document.slides[editorStore.slideIndex].root.children.push(
        new Frame().setRect(new Rect(10, 20, 150, 200)).setFill({
          type: 'radial',
          stops: [
            { offset: 0, color: '#ff0000' },
            { offset: 1, color: '#00ff00' }
          ]
        })
      )
    }

    // Reset Document
    function reset () : void {
      editorStore.$reset()
    }

    var obj = {
      some: 'object'
    }
    var enc = bufferEncode(obj)
    var dec = bufferDecode(enc)

    console.log(obj, enc, dec)

    return {
      editorStore,
      createRect,
      reset
    }
  }
})
</script>
