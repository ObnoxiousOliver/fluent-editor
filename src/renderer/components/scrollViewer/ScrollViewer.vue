<template>
  <div
    :class="['scroll-viewer', {
      'scroll-viewer--x': x,
      'scroll-viewer--y': y
    }]"
    @mouseenter="updateScrollSize"
  >
    <div
      ref="scroller"
      class="scroll-viewer__scroller"
      @scroll="scroll"
      @change="change"
    >
      <div
        ref="content"
        class="scroll-viewer__content"
      >
        <slot />
      </div>
    </div>
    <ScrollBar
      v-if="scrollY"
      :progress="scrollTop / (scrollHeight - offsetHeight)"
      :thumbSize="offsetHeight / scrollHeight"
      :thin="thin"
      @scrollbar:scroll="scrollbarScrollVertical"
    />
    <ScrollBar
      v-if="scrollX"
      :progress="scrollLeft / (scrollWidth - offsetWidth)"
      :thumbSize="offsetWidth / scrollWidth"
      horizontal
      :thin="thin"
      @scrollbar:scroll="scrollbarScrollHorizontal"
    />
  </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import ScrollBar from './ScrollBar.vue'
import { onBeforeUnmount, onMounted } from '@vue/runtime-core'

export default {
  components: { ScrollBar },

  props: {
    x: { type: Boolean, default: () => true },
    y: { type: Boolean, default: () => true },
    thin: Boolean
  },

  setup (props) {
    // console.log(props)

    const scroller = ref(null)
    const content = ref(null)

    const scrollY = ref(false)
    const scrollX = ref(false)

    const scrollTop = ref(0)
    const scrollLeft = ref(0)
    const scrollHeight = ref(0)
    const scrollWidth = ref(0)
    const offsetHeight = ref(0)
    const offsetWidth = ref(0)

    function scroll (e) {
      scrollTop.value = scroller.value.scrollTop
      scrollLeft.value = scroller.value.scrollLeft
    }

    function scrollbarScrollVertical (e) {
      scroller.value.scrollTop = e * (scrollHeight.value - offsetHeight.value)
    }

    function scrollbarScrollHorizontal (e) {
      scroller.value.scrollLeft = e * (scrollWidth.value - offsetWidth.value)
    }

    const observer = new ResizeObserver(() => updateScrollSize())

    function updateScrollSize () {
      scrollHeight.value = scroller.value.scrollHeight
      scrollWidth.value = scroller.value.scrollWidth

      offsetHeight.value = scroller.value.offsetHeight
      offsetWidth.value = scroller.value.offsetWidth

      scrollX.value = props.x && scroller.value.scrollWidth > scroller.value.offsetWidth
      scrollY.value = props.y && scroller.value.scrollHeight > scroller.value.offsetHeight
    }

    onMounted(() => {
      observer.observe(content.value)
      observer.observe(scroller.value)
    })
    onBeforeUnmount(() => {
      observer.unobserve(content.value)
      observer.unobserve(scroller.value)
    })

    return {
      content,
      scroller,
      scrollY,
      scrollX,
      scrollTop,
      scrollLeft,
      scrollHeight,
      scrollWidth,
      offsetHeight,
      offsetWidth,
      scroll,
      scrollbarScrollVertical,
      scrollbarScrollHorizontal,
      updateScrollSize
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-viewer {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;

  height: 100%;
  width: 100%;

  &__scroller {
    overflow: hidden;
    grid-column: 1 / 3;
    grid-row: 1 / 3;
    height: 100%;
    width: 100%;
    scrollbar-width: none;
  }

  &--x &__scroller {
    overflow-x: auto;
  }
  &--y &__scroller {
    overflow-y: auto;
  }

  &__scroller::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  .scrollbar {
    z-index: 1;
    opacity: 0;
    transition: opacity 1s .2s;

    &--vertical {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
    &--horizontal {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }
  }

  &:hover .scrollbar, .scrollbar--dragging {
    opacity: 1;
    transition: opacity .1s;
  }
}
</style>
