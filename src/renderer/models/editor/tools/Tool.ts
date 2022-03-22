import { Interactable } from '@interactjs/types'

export interface ToolSetupArguments {
  interaction: Interactable,
  editor: any
}

export default interface ToolExtention {
  name: string,

  overlayComponent?: any,

  deactivated?(editor: any): void
  setup?(args: ToolSetupArguments): void

  // onBox?(): void,
  // onTap?(): void
}

export const tools: {
  [x: string]: ToolExtention
} = {}

export function extendTool (tool: ToolExtention) {
  tools[tool.name] = tool
}
export function defineTool (tool: ToolExtention) {
  return tool
}
