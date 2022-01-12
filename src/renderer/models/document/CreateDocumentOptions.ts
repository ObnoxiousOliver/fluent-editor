import Attachment from './Attachment'
import DocumentSize from './DocumentSize'
import { Slide } from './slide'

export interface CreateDocumentOptions {
  size: DocumentSize,
  slides: Slide[],
  attachments: Attachment[]
}
