<template>
  <div
    v-if="item?.role === 'divider'"
    class="app-submenu-divider"
  />
  <button
    v-else
    :class="['app-submenu-btn', {
      'focus': focused
    }]"
  >
    <div class="app-submenu-btn__icon">
      <bi :i="item?.icon" />
    </div>
    <div class="app-submenu-btn__name">
      {{ name[0] }}<u>{{ name[1] }}</u>{{ name[2] }}
    </div>
    <div class="app-submenu-btn__shortcut">
      {{ shortcut }}
    </div>
  </button>
</template>

<script lang="ts">
import { useActions } from '@/renderer/store'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    item: Object,
    focused: Boolean
  },

  setup (props) {
    const actions = useActions()

    const name = computed(() => {
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

    const shortcut = computed(() => actions.registeredActions[props.item?.action]?.keyboardShortcuts
      ?.map(x => x.map(y => y[0].toUpperCase() + y.substring(1)).join('+')).join(', '))

    return {
      name,
      shortcut,
      actions
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.app-submenu-divider {
  height: 1px;
  margin: 5px 10px;

  @include r.dark {
    background: r.$col-500;
  }
  @include r.light {
    background: r.$col-100;
  }
}

.app-submenu-btn {
  @include r.buttonReset;

  display: flex;
  width: 100%;
  padding: 3px 30px 3px 10px;
  text-align: start;

  cursor: pointer;
  transition: background .1s, color .1s;

  &.focus {
    @include r.dark {
      background: r.$col-500;
      color: r.$col-white;
    }
    @include r.light {
      background: r.$col-100;
      color: r.$col-800;
    }
  }

  &__icon {
    display: inline-block;
    width: 20px;
  }

  &__name {
    flex: 1 1 auto;
    width: 0;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
