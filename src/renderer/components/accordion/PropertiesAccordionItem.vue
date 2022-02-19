<template>
  <div
    :class="{
      'properties-accordion-item': true,
      'properties-accordion-item--closed': !openRaw
    }"
    :style="{
      opacity: show ? null : 0
    }"
  >
    <button
      class="properties-accordion-item__header"
      @click="toggleOpen"
    >
      <div class="properties-accordion-item__header__name">
        {{ $t(item.name) }}
      </div>
      <div class="properties-accordion-item__header__arrow">
        <bi i="chevron-down" />
      </div>
    </button>
    <transition
      name="properties-accordion-item__body"
      :css="show"
    >
      <div
        v-if="open"
        class="properties-accordion-item__body"
        ref="body"
        :style="{
          '--height': height && height + 'px'
        }"
      >
        <ProptertiesPanelItem
          v-for="(contentItem, i) in item.content"
          :key="i"
          :item="contentItem"
          :editor="editor_"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import EditorInstance from '@/renderer/models/editor/EditorInstance'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'

export default defineComponent({
  props: {
    item: Object,
    editor: Object
  },

  setup (props) {
    const body = ref(null as HTMLElement | null)

    const editor_ = ref(props.editor as EditorInstance)

    const open = ref(true)
    const openRaw = computed({
      get: () => editor_.value?.state.openPropertyPanels[props.item?.id],
      set: val => {
        if (!props.item?.id || !editor_.value) return

        editor_.value.state.openPropertyPanels[props.item.id] = val
      }
    })
    const show = ref(false)
    const height = ref(null as number | null)

    watch(openRaw, () => {
      open.value = openRaw.value
    })

    onMounted(() => {
      if (!openRaw.value) {
        setHeight()

        setTimeout(() => {
          open.value = false
        })
      } else { setHeight() }

      setTimeout(() => {
        show.value = true
      })
    })

    function toggleOpen () {
      setHeight()

      setTimeout(() => {
        if (!props.item?.id) return

        if (!openRaw.value) {
          openRaw.value = true
        } else {
          openRaw.value = !openRaw.value
        }
      })
    }

    function setHeight () {
      var h = body.value?.getBoundingClientRect().height ?? null

      if (h) height.value = h
    }

    return {
      editor_,
      body,
      open,
      openRaw,
      show,
      height,
      toggleOpen
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.properties-accordion-item {
  &::after {
    content: '';
    display: block;
    margin: 10px 10px 0;
  }

  @include r.light {
    &::after {
      border-top: r.$col-100 solid 1px;
    }
  }
  @include r.dark {
    &::after {
      border-top: r.$col-500 solid 1px;
    }
  }

  $duratuion: 0.2s;

  &__header {
    @include r.buttonReset;
    text-align: start;
    cursor: pointer;

    width: 100%;

    display: flex;
    gap: 20px;
    padding: 0 20px;
    margin: 10px 0 0;

    &__name {
      flex: 1 1 auto;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      font-weight: 600;
      letter-spacing: 0.2em;
      text-transform: uppercase;
    }

    &__arrow {
      transition: transform $duratuion;

      .properties-accordion-item--closed & {
        transform: rotate(90deg);
      }
    }
  }

  &__body {
    padding: 0 20px;
    display: flex;
    flex-flow: column nowrap;
    gap: 10px;
    margin: 10px 0 0;

    &-enter-active, &-leave-active {
      transition: height $duratuion, margin $duratuion;
      overflow: hidden;
    }
    &-enter-from, &-leave-to {
      height: 0;
      margin-top: 0;
    }
    &-enter-to, &-leave-from {
      height: var(--height);
    }
  }
}
</style>
