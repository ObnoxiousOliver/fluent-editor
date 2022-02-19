<template>
  <EditorContent :editor="editor" />
</template>

<script>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import FluentTiptapKit from './fluent-tiptap-kit'
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'

export default {
  emits: [
    'update:html',
    'update:json',
    'editor:blur'
  ],

  components: {
    EditorContent
  },

  props: {
    html: String,
    json: Object
  },

  setup (props, { emit }) {
    const html_ = ref(props.html)
    watch(() => props.html, () => {
      html_.value = props.html
    })
    watch(html_, val => {
      emit('update:html', val)
      // editor.value.commands.setContent(val)
    })

    const json_ = ref(props.json)
    watch(() => props.html, () => {
      json_.value = props.html
    })
    watch(json_, val => {
      emit('update:json', val)
      // editor.value.commands.setContent(val)
    })

    const editor = useEditor({
      content: html_.value ?? json_.value,
      extensions: [FluentTiptapKit],
      onUpdate (e) {
        html_.value = e.editor.getHTML()
        json_.value = e.editor.getJSON()
      },
      onCreate (e) {
        e.editor.commands.focus()
        window.activeTiptapEditor = e.editor
      },
      onDestroy (e) {
        window.activeTiptapEditor = undefined
      }
    })

    return {
      html_,
      json_,
      editor
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../../../../scss' as r;

:deep(.ProseMirror-selectednode) {
  @include r.textSelection;
}
</style>
