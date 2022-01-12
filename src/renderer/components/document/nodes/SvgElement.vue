<template>
  <component
    :is="tag"
    :fill="fillString"
    v-bind="$attrs"
  />

  <defs v-if="defs_.length">
    <component
      v-for="def in defs_"
      :key="`${id}_${def.tag}`"
      :id="`${id}_${def.tag}`"
      :is="def.tag"
    >
      {{ def.children?.map(x => getDef(x)).join('') }}
    </component>
  </defs>
</template>

<script lang="ts">
import Gradient, { Stop } from '@/renderer/models/vector/Gradient'
import { computed, defineComponent } from '@vue/runtime-core'

interface DefComponent {
  tag: string,
  attributes: object,
  children: DefComponent[]
}

export default defineComponent({
  name: 'SvgElement',

  props: {
    tag: String,
    fill: [String, Object],
    defs: { type: Array, default: () => [] },
    id: String
  },

  setup (props) {
    const fillToDefs = computed(() => typeof (props.fill) === 'string'
      ? []
      : [{
        tag: ({
          radial: 'radialGradient',
          linear: 'linearGrandient'
        })[(props.fill as Gradient).type],
        children: (props.fill as Gradient).stops?.map((x: Stop) => ({
          tag: 'stop',
          attributes: {
            offset: (x.offset as number) * 100 + '%',
            color: x.color
          }
        } as DefComponent))
      } as DefComponent]
    )

    const fillString = computed(() => typeof (props.fill) === 'string'
      ? props.fill
      : `url(#${props.id}_${fillToDefs.value[0].tag})`)

    function getDef (def: DefComponent) : string {
      return `
        <${def.tag} ${(def.attributes && Object.keys(def.attributes)?.map(key => `${key}="${(def.attributes as any)[key]}"`).join(' ')) ?? ''}>
          ${def.children?.map(x => getDef(x)).join('') ?? ''}
        </${def.tag}>
      `
    }

    const defs_ = computed(() => [
      ...fillToDefs.value,
      ...props.defs
    ])

    return {
      fillString,
      getDef,
      defs_
    }
  }
})
</script>
