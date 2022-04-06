<template>
  <div
    class="slide-canvas"
    ref="root"
    @wheel.stop.prevent.ctrl="wheelZoom"
    @wheel.stop.prevent.shift="wheel"
    @wheel.stop.prevent.exact="wheel"
    @mousedown.middle="mousedown"

    @pointermove="pointermove"
    @contextmenu="contextmenu"

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
          transform: `translate(${animatedPosX ?? pixelPerfectPosX}px, ${animatedPosY ?? pixelPerfectPosY}px)`,
        }"
      >
        <SlideRenderer
          :document="editor_.state.document"
          :activeSlide="editor_.state.active"
          :scale="scale"
          class="slide-canvas__renderer"
          :editor="editor_"
        />
        <!-- :posX="Math.round(posX)"
        :posY="Math.round(posY)" -->
        <CanvasLayers
          ref="canvasLayers"
          :canvas="$refs.canvas"
          :overlay="$refs.canvasOverlay"
          :editor="editor_"
          :scale="scale"
          :posX="pixelPerfectPosX"
          :posY="pixelPerfectPosY"
          :viewportWidth="viewportWidth"
          :viewportHeight="viewportHeight"
          class="slide-canvas__layers"
        />
      </div>

      <div
        class="slide-canvas__canvas__overlay"
        ref="canvasOverlay"
      />
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
import { computed, defineComponent, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, watch } from 'vue'

import interact from 'interactjs'
import { clamp } from '@/renderer/utils/math'
import getElementPath from '@/renderer/utils/getElementPath'

import { useActions, useRuntime } from '@/renderer/store'
import EditorInstance from '@/renderer/models/editor/EditorInstance'

import SlideRenderer from '@/renderer/components/document/SlideRenderer.vue'
import ScrollBar from '../scrollViewer/ScrollBar.vue'
import CanvasLayers from './CanvasLayers.vue'
import ToolExtention, { tools } from '@/renderer/models/editor/tools/Tool'
// import NodeTypes from '@/renderer/models/nodes/NodeTypes'

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
    const canvasLayers = ref()
    const canvas = ref(null as HTMLElement | null)
    const coord = ref(null as HTMLElement | null)

    const editor_ = ref(props.editor as EditorInstance | null)
    const actions = useActions()
    const runtime = useRuntime()

    // #region CANVAS NAVIGATION
    const SCALE_FACTOR = 1.5
    const SCALE_MIN = 0.01
    const SCALE_MAX = 100
    const PADDING = 50

    const fitToScreen = computed({
      get: () => editor_.value?.state.canvas.fixToScreen ?? false,
      set: val => { if (editor_.value) editor_.value.state.canvas.fixToScreen = val }
    })

    onActivated(() => {
      actions.hook('canvas-zoom-1', canvasZoom1)
      actions.hook('canvas-zoom-fit-to-screen', canvasZoomFitToScreen)
      actions.hook('canvas-zoom-in', canvasZoomIn)
      actions.hook('canvas-zoom-out', canvasZoomOut)
    })

    onDeactivated(() => {
      actions.unhook('canvas-zoom-1', canvasZoom1)
      actions.unhook('canvas-zoom-fit-to-screen', canvasZoomFitToScreen)
      actions.unhook('canvas-zoom-in', canvasZoomIn)
      actions.unhook('canvas-zoom-out', canvasZoomOut)
    })

    function canvasZoom1 () {
      scale.value = 1
      fitToScreen.value = false
    }
    function canvasZoomFitToScreen () {
      fitToScreen.value = true
    }
    function canvasZoomIn () {
      scale.value *= SCALE_FACTOR
      fitToScreen.value = false
    }
    function canvasZoomOut () {
      scale.value /= SCALE_FACTOR
      fitToScreen.value = false
    }

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
    const scale = computed({
      get: () => editor_.value?.state.canvas.scale ?? 1,
      set: val => { if (editor_.value) editor_.value.state.canvas.scale = val }
    })

    watch(scale, () => {
      scale.value = clamp(scale.value, SCALE_MIN, SCALE_MAX)

      emit('update:zoomFactor', scale.value)
    })

    watch(() => props.zoomFactor, val => {
      fitToScreen.value = false
      scale.value = val
    })

    function wheelZoom (e: WheelEvent) {
      if (e.deltaY === 0 || runtime.movingElement) return

      const rect = coord.value!.getBoundingClientRect()

      if (scale.value >= SCALE_MIN && scale.value <= SCALE_MAX) {
        const scaleDelta = clamp(scale.value * SCALE_FACTOR ** (-e.deltaY / 100), SCALE_MIN, SCALE_MAX) / scale.value

        posX.value -= (e.clientX - rect.x) * scaleDelta - (e.clientX - rect.x)
        posY.value -= (e.clientY - rect.y) * scaleDelta - (e.clientY - rect.y)

        if (startPosX && startPosY) {
          startPosX -= (e.clientX - rect.x) * scaleDelta - (e.clientX - rect.x)
          startPosY -= (e.clientY - rect.y) * scaleDelta - (e.clientY - rect.y)
        }
      }

      // console.log(e)

      scale.value *= SCALE_FACTOR ** (-e.deltaY / 100)

      fitToScreen.value = false
    }
    // #endregion

    // #region Move
    const posX = computed({
      get: () => editor_.value?.state.canvas.posX ?? 0,
      set: val => { if (editor_.value) editor_.value.state.canvas.posX = val }
    })
    const posY = computed({
      get: () => editor_.value?.state.canvas.posY ?? 0,
      set: val => { if (editor_.value) editor_.value.state.canvas.posY = val }
    })
    const animatedPosX = ref(null as number | null)
    const animatedPosY = ref(null as number | null)

    const pixelPerfectPosX = computed(() => {
      var a = (editor_.value?.state.document.meta.size.width ?? 0) / 2 * scale.value

      return Math.round(posX.value) + a - Math.round(a)
    })
    const pixelPerfectPosY = computed(() => {
      var a = (editor_.value?.state.document.meta.size.height ?? 0) / 2 * scale.value

      return Math.round(posY.value) + a - Math.round(a)
    })

    const dragging = ref(false)

    var startClientX: number | null = null
    var startClientY: number | null = null
    var startPosX: number | null = null
    var startPosY: number | null = null

    onMounted(() => {
      var interactable = interact(root.value!)
        .styleCursor(false)
        .draggable({
          manualStart: true,
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

              actions.cursor = 'grabbing'

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

              actions.cursor = null

              dragging.value = false
            }
          }
        })
        .on('down', function (event) {
          var interaction = event.interaction

          // if the pointer was moved while being held down
          // and an interaction hasn't started yet
          if (interaction.pointerIsDown && !interaction.interacting()) {
            if (event.buttons === 4) {
              interaction.start({ name: 'drag' }, event.interactable, event.currentTarget)
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
      // if (animatedPosX.value === null) animatedPosX.value = posX.value
      // if (animatedPosY.value === null) animatedPosY.value = posY.value

      // if (ax) ax.pause()
      // if (ay) ay.pause()

      // ax = anime({
      //   targets: animatedPosX,
      //   value: targetX,
      //   easing: 'easeOutQuad',
      //   duration: 100,
      //   complete () {
      //     animatedPosX.value = null
      //   }
      // })

      // ay = anime({
      //   targets: animatedPosY,
      //   value: targetY,
      //   easing: 'easeOutQuad',
      //   duration: 100,
      //   complete () {
      //     animatedPosY.value = null
      //   }
      // })

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

    const viewportWidth = ref(0)
    const viewportHeight = ref(0)

    function updateScrollViewRect () {
      const rootRect = root.value!.getBoundingClientRect()

      viewportWidth.value = rootRect.width
      viewportHeight.value = rootRect.height

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
      // console.log(e)
      posX.value -= root.value!.scrollLeft
      posY.value -= root.value!.scrollTop
      root.value!.scrollLeft = 0
      root.value!.scrollTop = 0
    }

    // #endregion
    // #endregion

    var scaleStart: number | null
    onMounted(() => {
      setCanvasInteraction()
      setupTool()
    })
    onBeforeUnmount(() => {
      interact(canvas.value!).unset()
    })

    function setCanvasInteraction () {
      interact(canvas.value!).unset()
      interact(canvas.value!)
        // Gesture
        .gesturable({
          listeners: {
            start () {
              scaleStart = scale.value
            },
            move (e: any) {
              const rect = coord.value!.getBoundingClientRect()

              if (scale.value >= SCALE_MIN && scale.value <= SCALE_MAX) {
                const scaleDelta = clamp(scaleStart! * e.scale, SCALE_MIN, SCALE_MAX) / scale.value

                posX.value -= (e.client.x - rect.x) * scaleDelta - (e.client.x - rect.x)
                posY.value -= (e.client.y - rect.y) * scaleDelta - (e.client.y - rect.y)

                if (startPosX && startPosY) {
                  startPosX -= (e.client.x - rect.x) * scaleDelta - (e.client.x - rect.x)
                  startPosY -= (e.client.y - rect.y) * scaleDelta - (e.client.y - rect.y)
                }
              }

              posX.value += e.delta.x
              posY.value += e.delta.y

              scale.value = scaleStart! * e.scale
            }
          }
        })
        // SELECTION
        .on('down', (e: any) => {
          if (editor_.value?.state.activeTool !== 'selection') return
          if (e.buttons !== 1) return

          // Don't trigger if Tap originated in CanvasLayers
          if (getElementPath(e.target).find(x => x.classList?.contains('dont-interact'))) return

          // console.log(e)

          var hovering = elementsAtPointOnScreen(e.clientX, e.clientY)

          if (e.button === 0) {
            if (hovering.length) {
              const el = hovering[0]

              if (!editor_.value!.state.selection.selection.includes(el)) {
                // Element isn't yet selected

                if (e.shiftKey) {
                  // Add hovering element to selection
                  editor_.value!.state.selection.selection.push(el)
                } else {
                  // Set hovering element as selection
                  editor_.value!.state.selection.selection = [el]
                }

                // Set editing element if its a text Node
                // if (runtime.currentTab?.registeredElements[el]?.node?.type === NodeTypes.Text) {
                //   editor_.value!.state.selection.editing = el
                // }
              } else if (e.shiftKey) {
                // Element is already selected
                // Remove element from selection
                editor_.value!.state.selection.selection.splice(
                  editor_.value!.state.selection.selection.indexOf(hovering[0]), 1)

                // Unset editing element if it's deselected
                if (editor_.value!.state.selection.editing === hovering[0]) {
                  editor_.value!.state.selection.editing = null
                }
              }
            } else {
              // Unset selection
              editor_.value!.state.selection.selection = []
              editor_.value!.state.selection.editing = null
            }
          }
        })
    }

    // Initialize Interaction on active Tool
    const activeTool = computed(() => editor_.value?.state.activeTool)
    const tool = computed(() => tools[activeTool.value ?? ''] as ToolExtention | undefined)

    function setupTool () {
      // Call setup event
      if (tool.value?.setup) {
        tool.value.setup({
          interaction: interact(canvas.value!),
          editor: editor_,
          root: root,
          viewportWidth: viewportWidth,
          viewportHeight: viewportHeight
        })
      }
    }

    watch(tool, (val, old) => {
      // Call deactivated event on last Tool
      if (old?.deactivated) {
        old.deactivated(editor_.value)
      }

      // Create new canvas interacton
      setCanvasInteraction()

      setupTool()
    })

    // Calculate Element Hovering the mouse cursor is hovering
    function pointermove (e: PointerEvent) {
      if (e.pointerType === 'touch') return
      if (!runtime.currentTab) return

      runtime.currentTab.hovering = elementsAtPointOnScreen(e.clientX, e.clientY)
    }

    function elementsAtPointOnScreen (clientX: number, clientY: number): string[] {
      if (!runtime.currentTab) return []

      const rootRect = root.value!.getBoundingClientRect()

      const docX = posX.value + (viewportWidth.value - (editor_.value?.state.document.meta.size.width ?? 0) * scale.value) * 0.5
      const docY = posY.value + (viewportHeight.value - (editor_.value?.state.document.meta.size.height ?? 0) * scale.value) * 0.5

      const x = (clientX - rootRect.x - docX) / scale.value
      const y = (clientY - rootRect.y - docY) / scale.value

      var elements = Object.values(runtime.currentTab?.registeredElements)

      // console.log(elements)

      var hovering = elements.filter(el => {
        return el.boundingBox.x < x && el.boundingBox.x + (el.boundingBox.width ?? 0) > x &&
          el.boundingBox.y < y && el.boundingBox.y + (el.boundingBox.height ?? 0) > y
      }).sort(a => -(a.order ?? 0)).map(x => x.id)

      // console.log(hovering)
      return hovering
    }

    // #region CONTEXTMENU

    function contextmenu (e: MouseEvent) {
    }

    // #endregion

    return {
      root,
      canvasLayers,
      canvas,
      coord,
      editor_,
      actions,
      fitToScreen,
      scale,
      wheelZoom,
      posX,
      posY,
      pixelPerfectPosX,
      pixelPerfectPosY,
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
      scroll,
      viewportWidth,
      viewportHeight,
      pointermove,
      contextmenu
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

  @include r.light {
    background: r.$col-100;
  }
  @include r.dark {
    background: r.$col-800;
  }

  &__canvas {
    position: absolute;
    inset: 0;

    &__overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
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
    overflow: visible;
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
