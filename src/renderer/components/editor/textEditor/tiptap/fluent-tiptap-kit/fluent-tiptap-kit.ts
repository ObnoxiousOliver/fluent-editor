import { Extension } from '@tiptap/vue-3'

import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'

import HardBreak from '@tiptap/extension-hard-break'
import Italic from '@tiptap/extension-italic'
import TextAlign from '@tiptap/extension-text-align'

// import Dropcursor from '@tiptap/extension-dropcursor'
// import Gapcursor from '@tiptap/extension-gapcursor'

import { FontFamily } from './FontFamily'
import { FontWeight } from './FontWeight'
import { FontSize } from './FontSize'
import { TextColor } from './TextColor'
import { LineHeight } from './LineHeight'
import { LetterSpacing } from './LetterSpacing'
import { Strike } from './Strike'
import { Underline } from './Underline'

export const FluentTiptapKit = Extension.create({
  addExtensions () {
    return [
      FontFamily,
      FontWeight,
      FontSize,
      TextColor,
      LineHeight.configure({ types: ['paragraph'] }),
      LetterSpacing,
      Strike,
      Underline,

      HardBreak,
      Italic,
      TextAlign.configure({ types: ['paragraph'] }),

      // Dropcursor,
      // Gapcursor,

      Document,
      Paragraph.extend({
        parseHTML: () => [
          { tag: 'p' },
          { tag: 'div', getAttrs: node => (node as HTMLElement).style.display === 'block' && null }
        ]
      }),
      Text
    ]
  }
})
