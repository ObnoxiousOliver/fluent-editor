<template>
  <div
    class="slide-canvas"
    ref="root"
    @wheel.ctrl="wheelZoom"
    @wheel.shift="wheel"
    @wheel.exact="wheel"
    @mousedown.middle="mousedown"

    @scroll="scroll"
  >
    <div
      class="slide-canvas__canvas"
      ref="canvas"
    >
      <div
        class="slide-canvas__coord-system"
        ref="coord"
        :style="{
          transform: `translate(${animatedPosX ?? Math.round(posX)}px, ${animatedPosY ?? Math.round(posY)}px)`,
        }"
      >
        <SlideRenderer
          :document="editor_.state.document"
          :activeSlide="editor_.state.active"
          :scale="scale"
          class="slide-canvas__renderer"
        />
        <CanvasLayers
          :editor="editor_"
          :scale="scale"
          class="slide-canvas__layers"
        >
          hello
        </CanvasLayers>
      </div>
    </div>
    <ScrollBar
      :class="$bem('slide-canvas__scrollbar', 'vertical')"
      :progress="scrollbarProgressY"
      :thumbSize="scrollbarSizeY"
      :transparent="true"
      @scrollbar:dragstart="scrollYDragStart"
      @scrollbar:dragmove="scrollYDragMove"
      @scrollbar:dragend="scrollYDragEnd"
    />
    <ScrollBar
      :class="$bem('slide-canvas__scrollbar', 'horizontal')"
      :horizontal="true"
      :progress="scrollbarProgressX"
      :thumbSize="scrollbarSizeX"
      :transparent="true"
      @scrollbar:dragstart="scrollXDragStart"
      @scrollbar:dragmove="scrollXDragMove"
      @scrollbar:dragend="scrollXDragEnd"
    />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import interact from 'interactjs'
import anime from 'animejs'
import clamp from '@/renderer/utils/clamp'

import { useActions } from '@/renderer/store'
import EditorInstance from '@/renderer/models/editor/EditorInstance'

import SlideRenderer from '@/renderer/components/document/SlideRenderer.vue'
import ScrollBar from '../scrollViewer/ScrollBar.vue'
import CanvasLayers from './CanvasLayers.vue'

export default defineComponent({
  components: { SlideRenderer, ScrollBar, CanvasLayers },
  emits: [
    'update:zoomFactor'
  ],
  props: {
    editor: Object,
    zoomFactor: { type: Number, default: () => 1 }
  },

  setup (props, { emit }) {
    const root = ref(null as HTMLElement | null)
    const canvas = ref(null as HTMLElement | null)
    const coord = ref(null as HTMLElement | null)

    const editor_ = ref(props.editor as EditorInstance | null)
    const actions = useActions()

    // #region CANVAS NAVIGATION
    const SCALE_FACTOR = 1.2
    const SCALE_MIN = 0.01
    const SCALE_MAX = 10
    const PADDING = 50

    const fitToScreen = ref(true)

    actions.addAction({
      id: 'canvas-zoom-1',
      keyboardShortcuts: [['ctrl', '0']],
      callback () {
        scale.value = 1
        fitToScreen.value = false
      }
    })
    actions.addAction({
      id: 'canvas-zoom-fit-to-screen',
      keyboardShortcuts: [['ctrl', '1']],
      callback () {
        fitToScreen.value = true
      }
    })
    actions.addAction({
      id: 'canvas-zoom-in',
      keyboardShortcuts: [['ctrl', '=']],
      callback () {
        scale.value *= SCALE_FACTOR
        fitToScreen.value = false
      }
    })
    actions.addAction({
      id: 'canvas-zoom-out',
      keyboardShortcuts: [['ctrl', '-']],
      callback () {
        scale.value /= SCALE_FACTOR
        fitToScreen.value = false
      }
    })

    watch(fitToScreen, val => {
      if (val) {
        posX.value = 0
        posY.value = 0
        scaleToFitScreen()
      }
    })

    onMounted(() => {
      scaleToFitScreen()

      const observer = new ResizeObserver(() => {
        if (fitToScreen.value) {
          scaleToFitScreen()
        }

        updateScrollViewRect()
      })
      observer.observe(root.value!)

      onBeforeUnmount(() => observer.unobserve(root.value!))
    })

    function scaleToFitScreen () {
      scale.value = Math.min(
        ((root.value?.getBoundingClientRect().width ?? 0) - PADDING * 2) / (editor_.value?.state?.document?.meta.size.width ?? 1),
        ((root.value?.getBoundingClientRect().height ?? 0) - PADDING * 2) / (editor_.value?.state?.document?.meta.size.height ?? 1))
    }

    // #region Zoom
    const scale = ref(props.zoomFactor)

    watch(scale, () => {
      scale.value = clamp(scale.value, SCALE_MIN, SCALE_MAX)

      emit('update:zoomFactor', scale.value)
    })

    watch(() => props.zoomFactor, val => {
      fitToScreen.value = false
      scale.value = val
    })

    function wheelZoom (e: WheelEvent) {
      if (e.deltaY === 0) return

      const rect = coord.value!.getBoundingClientRect()

      if (scale.value >= SCALE_MIN && scale.value <= SCALE_MAX) {
        const scaleDelta = e.deltaY < 0
          ? clamp(scale.value * SCALE_FACTOR, SCALE_MIN, SCALE_MAX) / scale.value
          : clamp(scale.value / SCALE_FACTOR, SCALE_MIN, SCALE_MAX) / scale.value

        posX.value -= (e.clientX - rect.x) * scaleDelta - (e.clientX - rect.x)
        posY.value -= (e.clientY - rect.y) * scaleDelta - (e.clientY - rect.y)

        if (startPosX && startPosY) {
          startPosX -= (e.clientX - rect.x) * scaleDelta - (e.clientX - rect.x)
          startPosY -= (e.clientY - rect.y) * scaleDelta - (e.clientY - rect.y)
        }
      }

      if (e.deltaY < 0) scale.value *= SCALE_FACTOR
      else scale.value /= SCALE_FACTOR

      fitToScreen.value = false
    }
    // #endregion

    // #region Move
    const posX = ref(0)
    const posY = ref(0)
    const animatedPosX = ref(null as number | null)
    const animatedPosY = ref(null as number | null)

    const dragging = ref(false)

    var startClientX: number | null = null
    var startClientY: number | null = null
    var startPosX: number | null = null
    var startPosY: number | null = null

    onMounted(() => {
      var interactable = interact(root.value!)
        .styleCursor(false)
        .draggable({
          mouseButtons: 4,
          listeners: {
            start (event: any) {
              startClientX = event.clientX
              startClientY = event.clientY
              startPosX = posX.value
              startPosY = posY.value

              if (animatedPosX.value !== null) posX.value = animatedPosX.value
              if (animatedPosY.value !== null) posY.value = animatedPosY.value

              animatedPosX.value = null
              animatedPosY.value = null

              if (ax) ax.pause()
              if (ay) ay.pause()

              dragging.value = true
              fitToScreen.value = false
            },
            move (event: any) {
              posX.value = startPosX + event.pageX - startClientX!
              posY.value = startPosY + event.pageY - startClientY!
            },
            end () {
              startClientX = null
              startClientY = null
              startPosX = null
              startPosY = null

              dragging.value = false
            }
          }
        })

      onBeforeUnmount(() => interactable.unset())
    })

    function wheel (e: WheelEvent) {
      if (dragging.value) return

      animatePos(
        posX.value - (e.shiftKey ? e.deltaY : e.deltaX) * 0.5,
        posY.value - (e.shiftKey ? 0 : e.deltaY) * 0.5)

      fitToScreen.value = false
    }

    var ax: any = null
    var ay: any = null
    function animatePos (targetX: number, targetY: number) {
      if (animatedPosX.value === null) animatedPosX.value = posX.value
      if (animatedPosY.value === null) animatedPosY.value = posY.value

      if (ax) ax.pause()
      if (ay) ay.pause()

      ax = anime({
        targets: animatedPosX,
        value: targetX,
        easing: 'easeOutQuad',
        duration: 100,
        complete () {
          animatedPosX.value = null
        }
      })

      ay = anime({
        targets: animatedPosY,
        value: targetY,
        easing: 'easeOutQuad',
        duration: 100,
        complete () {
          animatedPosY.value = null
        }
      })

      posX.value = targetX
      posY.value = targetY
    }

    // Scrollbar
    const scrollViewRect = ref({
      width: 0,
      height: 0,
      x: 0,
      y: 0
    })

    const scrollbarProgressX = ref(0)
    const scrollbarProgressY = ref(0)

    const scrollbarSizeX = computed(() => (root.value?.getBoundingClientRect().width ?? 0) / scrollViewRect.value.width)
    const scrollbarSizeY = computed(() => (root.value?.getBoundingClientRect().height ?? 0) / scrollViewRect.value.height)

    function updateScrollViewRect () {
      const rootRect = root.value!.getBoundingClientRect()

      const documentSize = {
        width: (editor_.value?.state?.document?.meta.size.width ?? 0) * scale.value,
        height: (editor_.value?.state?.document?.meta.size.height ?? 0) * scale.value
      }

      const points: { x: number | undefined, y: number | undefined }[] = [
        { x: 0, y: 0 },
        { x: rootRect.width, y: rootRect.height },
        {
          x: (rootRect.width - documentSize.width) / 2 + posX.value,
          y: (rootRect.height - documentSize.height) / 2 + posY.value
        },
        {
          x: (rootRect.width + documentSize.width) / 2 + posX.value,
          y: (rootRect.height + documentSize.height) / 2 + posY.value
        }
      ]

      scrollViewRect.value = {
        width:
          Math.max(...points.map(x => x.x).filter(x => x !== undefined) as number[]) -
          Math.min(...points.map(x => x.x).filter(x => x !== undefined) as number[]),
        height:
          Math.max(...points.map(x => x.y).filter(x => x !== undefined) as number[]) -
          Math.min(...points.map(x => x.y).filter(x => x !== undefined) as number[]),

        x: Math.min(...points.map(x => x.x).filter(x => x !== undefined) as number[]),
        y: Math.min(...points.map(x => x.y).filter(x => x !== undefined) as number[])
      }

      scrollbarProgressX.value = (-scrollViewRect.value.x / (scrollViewRect.value.width - rootRect.width)) || 0
      scrollbarProgressY.value = (-scrollViewRect.value.y / (scrollViewRect.value.height - rootRect.height)) || 0
    }

    const scrolling = ref(false)
    watch(() => [posX.value, posY.value, scale.value], () => updateScrollViewRect())

    var startX: number | null = null
    var startY: number | null = null
    var scrollFactor: number | null = null

    function scrollXDragStart (event: any) {
      scrolling.value = true
      startX = posX.value
      scrollFactor = scrollViewRect.value.width / root.value!.getBoundingClientRect().width
    }
    function scrollXDragMove (event: any) {
      const delta = event.pageX - event.x0
      posX.value = startX! - delta * scrollFactor!
    }
    function scrollXDragEnd (event: any) {
      scrolling.value = false
      updateScrollViewRect()
    }

    function scrollYDragStart (event: any) {
      scrolling.value = true
      startY = posY.value
      scrollFactor = scrollViewRect.value.height / root.value!.getBoundingClientRect().height
    }
    function scrollYDragMove (event: any) {
      const delta = event.pageY - event.y0
      posY.value = startY! - delta * scrollFactor!
    }
    function scrollYDragEnd (event: any) {
      scrolling.value = false
      updateScrollViewRect()
    }

    // Handle Overflow scrolling
    function scroll (e: any) {
      console.log(e)
      posX.value -= root.value!.scrollLeft
      posY.value -= root.value!.scrollTop
      root.value!.scrollLeft = 0
      root.value!.scrollTop = 0
    }

    // #endregion
    // #endregion

    // #region SELECTION
    onMounted(() => {
      interact(canvas.value!)
        .on('tap', (e: any) => {
          if (editor_.value!.state.selection.hovering.length) {
            editor_.value!.state.selection.selection = [
              editor_.value!.state.selection.hovering[0]
            ]
          } else {
            editor_.value!.state.selection.selection = []
          }
        })
    })

    // #endregion

    return {
      root,
      canvas,
      coord,
      editor_,
      actions,
      fitToScreen,
      scale,
      wheelZoom,
      posX,
      posY,
      animatedPosX,
      animatedPosY,
      dragging,
      wheel,
      scrollViewRect,
      scrollbarProgressX,
      scrollbarProgressY,
      scrollbarSizeX,
      scrollbarSizeY,
      scrollXDragStart,
      scrollXDragMove,
      scrollXDragEnd,
      scrollYDragStart,
      scrollYDragMove,
      scrollYDragEnd,
      scroll
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.slide-canvas {
  position: relative;
  overflow: hidden;
  touch-action: none;

  &__canvas {
    position: absolute;
    inset: 0;
  }

  &__coord-system {
    position: absolute;
    width: 0;
    height: 0;
    top: 50%;
    left: 50%;
  }

  &__layers {
    transform: translate(-50%, -50%);
    z-index: 1;
    position: absolute;
    inset: 0;
  }

  &__renderer {
    display: block;
    transform: translate(-50%, -50%);

    @include r.light {
      outline: r.$bg-mod-black solid 1px;
    }
    @include r.dark {
      outline: r.$bg-mod-white solid 1px;
    }
  }

  &__fit-to-screen {
    @include r.buttonReset;

    position: absolute;
    inset: auto 0 0 auto;

    width: 18px;
    height: 18px;
    font-size: .4rem;

    i {
      display: inline-block;
      transform: rotate(45deg);
    }
  }

  &__scrollbar {
    position: absolute;

    &--vertical {
      height: auto;
      inset: 0 0 16px auto;
    }
    &--horizontal {
      width: auto;
      inset: auto 16px 0 0;
    }
  }
}
</style>
