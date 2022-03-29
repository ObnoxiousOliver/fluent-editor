import FluentTiptapKit from '@/renderer/components/editor/textEditor/tiptap/fluent-tiptap-kit'
import { generateJSON, JSONContent } from '@tiptap/vue-3'
import Node from './Node'
import NodeTypes from './NodeTypes'
import Rect from './Rect'

export interface TextNode {
  content: JSONContent
}

export default function createTextNode (rect: Rect, name?: string, id?: string) {
  return new Node(NodeTypes.Text, {
    content: generateJSON('', [FluentTiptapKit])
  } as TextNode, rect, name, id)
}
