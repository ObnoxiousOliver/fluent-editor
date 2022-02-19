<template>
  <component
    :is="tag"
    v-bind="{ ...$attrs, ...defs_.map(x => x.elementAttributes).reduce((a, b) => ({ ...a, ...b }), {})}"
  >
    <slot />
  </component>

  <defs
    v-if="defs_.some(x => x.tag)"
    v-html="defs_.map(x => getDefHtml(x)).join('')"
  />
</template>

<script lang="ts">
import fillDef from './paintDef'
import { computed, defineComponent } from '@vue/runtime-core'
import DefComponent from '@/renderer/models/svg/DefComponent'
import DefParser from '@/renderer/models/svg/DefParser'
import randomId from '@/renderer/utils/randomId'

export default defineComponent({
  name: 'SvgElement',

  props: {
    tag: String,
    defs: { type: Object, default: () => {} },
    _id: { String, default: () => randomId() }
  },

  setup (props) {
    const defsParsers: DefParser[] = [
      fillDef
    ]

    function getDefHtml (def: DefComponent): string {
      return def.tag ? `
        <${def.tag} ${(def.attributes && Object.keys(def.attributes)?.map(key => `${key}="${(def.attributes as any)[key]}"`).join(' ')) ?? ''}>
          ${def.children?.map(x => getDefHtml(x)).join('') ?? ''}
        </${def.tag}>
      ` : ''
    }

    const defs_ = computed(() => {
      var defs = props.defs

      var arr: DefComponent[] = []

      if (defs) {
        Object.keys(defs).forEach(def => {
          defsParsers.filter(x => x.types.includes(def)).forEach(parser => {
            var res = parser.parse((defs as any)[def], props._id, def)
            if (res) arr.push(res)
          })
        })
      }

      return arr
    })

    return {
      getDefHtml,
      defs_
    }
  }
})
</script>
