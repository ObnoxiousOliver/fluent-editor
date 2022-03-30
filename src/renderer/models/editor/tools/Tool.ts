import { Interactable } from '@interactjs/types'
import { Ref } from 'vue'

export interface ToolSetupArguments {
  interaction: Interactable,
  editor: Ref<any>,
  root: Ref<HTMLElement | null>,
  viewportWidth: Ref<number>,
  viewportHeight: Ref<number>
}

export default interface ToolExtention {
  name: string,
  icon?: string,

  overlayComponent?: any,

  deactivated?(editor: any): void
  setup?(args: ToolSetupArguments): void

  // onBox?(): void,
  // onTap?(): void
}

export const tools: {
  [x: string]: ToolExtention
} = {}

/**
 * extend Tool in App.vue
 * @param tool
 */
export function extendTool (tool: ToolExtention) {
  tools[tool.name] = tool
}
export function defineTool (tool: ToolExtention) {
  return tool
}
