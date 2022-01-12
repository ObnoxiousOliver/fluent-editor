import Attachment from './Attachment'
import { CreateDocumentOptions } from './CreateDocumentOptions'
import defaults from './defaults'
import DocumentMeta from './DocumentMeta'
import { createSlide, Slide } from './Slide'

export interface FluentDocument {
  meta: DocumentMeta,
  slides: Slide[],
  attachments: Attachment[]
}

export function createDocument (options?: CreateDocumentOptions) : FluentDocument {
  return {
    meta: {
      size: options?.size ?? defaults().document.size
    },
    slides: options?.slides ?? [createSlide()],
    attachments: options?.attachments ?? []
  }
}
