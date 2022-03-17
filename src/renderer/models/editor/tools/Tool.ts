import { Interactable } from '@interactjs/types'

export default interface ToolExtention {
  name: string,

  overlayComponent?: any,

  interact?(interaction: Interactable, editor: any): void

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
