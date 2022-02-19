<template>
  <button
    v-bind="$attrs"
    :class="['app-menu-btn', {
      focus: focused,
      'app-menu-btn__alt-focus': altFocus
    }]"
    ref="root"
  >
    {{ name[0] }}<u
      v-if="altFocus"
    >{{ name[1] }}</u>{{ name[2] }}
  </button>
  <AppSubmenu
    v-if="item?.submenu && focused && focus?.[1] !== undefined"
    :focus="focus.slice(1, focus.length)"
    @setFocus="(f) => $emit('setFocus', [focus?.[0], ...f])"

    :menu="item?.submenu"
    :x="root?.getBoundingClientRect().x"
    :y="root?.getBoundingClientRect().y + root?.getBoundingClientRect().height"
  />
</template>

<script lang="ts">
import { computed, ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'

import AppSubmenu from './AppSubmenu.vue'

export default {
  components: { AppSubmenu },
  emits: [
    'setFocus'
  ],
  props: {
    item: Object,
    focused: Boolean,
    focus: Array,
    index: Number,
    altFocus: Boolean
  },

  setup (props: any) {
    const root = ref(null as HTMLElement | null)

    const name = computed(() => {
      if (!props.altFocus) return [props.item?.name]

      var i = props.item?.name?.toLowerCase().split('')
        .findIndex((x: string) => x === props.item?.altKeyShortcutLetter?.toLowerCase())

      // console.log(i, Array(props.name?.toLowerCase()))

      if (i === -1) return [props.item?.name]

      return [
        props.item?.name?.slice(0, i),
        props.item?.name?.slice(i, i + 1),
        props.item?.name?.slice(i + 1, props.item?.name?.length)
      ]
    })

    watch(() => props.focused, () => {
      if (props.focused) {
        root.value!.focus()
      }
    })

    return {
      name,
      root
    }
  }
}
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.app-menu-btn {
  @include r.buttonReset;

  line-height: 1.5rem;
  padding: 0 0.5rem;
  color: r.$col-200;

  transition: background-color .1s, color .1s;

  -webkit-app-region: no-drag;

  &:focus {
    outline: none;
  }

  &.focus, &:not(.app-menu-btn__alt-focus):hover {
    background: r.$col-600;
    color: r.$col-white;
  }
}
</style>
