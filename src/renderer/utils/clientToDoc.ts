import { Ref } from 'vue'

export function clientToDoc (a: {
  editor: Ref<any>,
  root: Ref<HTMLElement | null>,
  viewportWidth: Ref<number>,
  viewportHeight: Ref<number>
}, x: number, y: number): { x: number, y: number } {
  const { editor, root, viewportWidth, viewportHeight } = a

  const { scale, posX, posY } = editor.value.state.canvas

  const docX = posX - (editor.value.state.document.meta.size.width ?? 0) * scale * 0.5
  const docY = posY - (editor.value.state.document.meta.size.height ?? 0) * scale * 0.5

  const rootRect = root.value!.getBoundingClientRect()

  return {
    x: (x - rootRect.x - docX) / scale - viewportWidth.value * 0.5 / scale,
    y: (y - rootRect.y - docY) / scale - viewportHeight.value * 0.5 / scale
  }
}
