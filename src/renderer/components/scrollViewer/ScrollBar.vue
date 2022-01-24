<template>
  <div
    :class="[ 'scrollbar', {
      'scrollbar--horizontal': horizontal,
      'scrollbar--vertical': !horizontal,
      'scrollbar--thin': thin,
      'scrollbar--transparent': transparent,
      'scrollbar--dragging': dragging
    }]"
    ref="root"
  >
    <div
      class="scrollbar__thumb"
      ref="thumb"
      :style="{
        height: (!horizontal) && (Math.max(0.1, thumbSize) * 100 + '%'),
        width: horizontal && (Math.max(0.1, thumbSize) * 100 + '%'),
        top: (!horizontal) && offset + 'px',
        left: horizontal && offset + 'px'
      }"
    />
  </div>
</template>

<script lang="ts">
import { ref } from '@vue/reactivity'
import { defineComponent, onBeforeUnmount, onMounted, watch } from '@vue/runtime-core'
import interact from 'interactjs'

export default defineComponent({
  emits: [
    'scrollbar:scroll',
    'scrollbar:dragstart',
    'scrollbar:dragmove',
    'scrollbar:dragend'
  ],
  props: {
    horizontal: Boolean,
    thin: Boolean,
    transparent: Boolean,
    progress: Number,
    thumbSize: { type: Number, default: () => 0.2 }
  },

  setup (props, { emit }) {
    const root = ref(null as HTMLElement | null)
    const thumb = ref(null as HTMLElement | null)

    const offset = ref(0)
    const dragging = ref(false)

    watch(() => [props.progress, props.thumbSize], () => updateOffset(), { deep: true })

    function updateOffset () {
      var size = props.horizontal ? root.value?.offsetWidth : root.value?.offsetHeight

      if (size && props.progress !== undefined) {
        offset.value = (size - Math.max(0.1, props.thumbSize) * size) * props.progress
      }
    }

    onMounted(() => {
      const observer = new ResizeObserver(() => updateOffset())
      observer.observe(root.value!)

      var start = 0
      interact(thumb.value!)
        .styleCursor(false)
        .draggable({
          listeners: {
            start (event: any) {
              start = props.progress ?? 0
              dragging.value = true

              emit('scrollbar:dragstart', event)
            },
            move (event: any) {
              emit('scrollbar:dragmove', event)

              const deltaX = event.pageX - event.x0
              const deltaY = event.pageY - event.y0

              if (props.horizontal ? Math.abs(deltaY) < 150 : Math.abs(deltaX) < 150) {
                var delta = props.horizontal ? deltaX : deltaY
                var size = props.horizontal ? root.value!.offsetWidth : root.value!.offsetHeight

                var sizeMinusThumbSize = (size - Math.max(0.1, props.thumbSize) * size)

                emit('scrollbar:scroll', Math.max(0, Math.min(1, start + delta / sizeMinusThumbSize)))
              } else {
                emit('scrollbar:scroll', start)
              }
            },
            end () {
              dragging.value = false
              emit('scrollbar:dragend', event)
            }
          }
        })

      onBeforeUnmount(() => {
        observer.unobserve(root.value!)
      })
    })

    return {
      root,
      offset,
      thumb,
      dragging
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.scrollbar {
  position: relative;
  touch-action: none;

  &__thumb {
    position: absolute;
    border: transparent solid 5px;
    background-clip: padding-box;
    border-radius: 8px;

    transition: background .1s;

    @include r.light {
      background-color: r.$col-200;
    }
    @include r.dark {
      background-color: r.$col-500;
    }

    &:hover, .scrollbar--dragging & {
      @include r.light {
        background-color: r.$col-300;
      }
      @include r.dark {
        background-color: r.$col-400;
      }
    }
  }

  &--thin {
    .scrollbar__thumb {
      border-width: 3px;
    }
  }
  &--transparent {
    .scrollbar__thumb {
      transition: background .1s, box-shadow .1s;

      &, &:hover, .scrollbar--dragging & {
        @include r.light {
          background-color: rgba(r.$col-black, 0.2);
          box-shadow: rgba(r.$col-white, 0.2) 0 0 0 1px inset;
        }
        @include r.dark {
          background-color: rgba(r.$col-black, 0.2);
          box-shadow: rgba(r.$col-white, 0.2) 0 0 0 1px inset;
        }
      }
    }
  }

  &--horizontal {
    width: 100%;
    height: 16px;

    .scrollbar__thumb {
      height: 100%;
    }

    &.scrollbar--thin {
      height: 10px;
    }
  }
  &--vertical {
    height: 100%;
    width: 16px;

    .scrollbar__thumb {
      width: 100%;
    }

    &.scrollbar--thin {
      width: 10px;
    }
  }
}
</style>
