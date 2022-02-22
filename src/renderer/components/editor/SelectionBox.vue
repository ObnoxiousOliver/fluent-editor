<template>
  <div
    :class="{
      'selection-box': true,
      'moving': moving,
      'resizeing-n': resizeingN,
      'resizeing-e': resizeingE,
      'resizeing-s': resizeingS,
      'resizeing-w': resizeingW
    }"
    :style="{
      top: element?.boundingBox.y * scale + 'px',
      left: element?.boundingBox.x * scale + 'px',
      width: element?.boundingBox.width * scale + 'px',
      height: element?.boundingBox.height * scale + 'px'
    }"
  >
    <div :class="$bem('selection-box__size-text', 'width')">
      {{ roundDecimalPlaces(element?.boundingBox.width) }}
    </div>
    <div :class="$bem('selection-box__size-text', 'height')">
      {{ roundDecimalPlaces(element?.boundingBox.height) }}
    </div>

    <div class="selection-box__handles">
      <div
        ref="move"
        class="selection-box__fill"
      />
      <div
        ref="edgeN"
        :class="$bem('selection-box__edge', 'n')"
      />
      <div
        ref="edgeE"
        :class="$bem('selection-box__edge', 'e')"
      />
      <div
        ref="edgeS"
        :class="$bem('selection-box__edge', 's')"
      />
      <div
        ref="edgeW"
        :class="$bem('selection-box__edge', 'w')"
      />
      <div
        ref="cornerNe"
        :class="$bem('selection-box__corner', 'ne')"
      />
      <div
        ref="cornerSe"
        :class="$bem('selection-box__corner', 'se')"
      />
      <div
        ref="cornerSw"
        :class="$bem('selection-box__corner', 'sw')"
      />
      <div
        ref="cornerNw"
        :class="$bem('selection-box__corner', 'nw')"
      />
    </div>

    <!-- <svg
      :width="(element?.boundingBox.width + 40) * scale + 'px'"
      :height="(element?.boundingBox.height + 40) * scale + 'px'"
      :style="{
        margin: -20 * scale
      }"
    >
      <g :transform="`scale(${scale})translate(20 20)`">
        <SvgElement
          v-bind="element?.shapeSvg"
          stroke="currentColor"
          :stroke-width="2 / scale"
          fill="none"
        />
        <g v-if="moving">
          <SvgElement
            v-bind="element?.shapeSvg"
            stroke="currentColor"
            :stroke-width="2 / scale"
            fill="white"
            filter="drop-shadow(#0004 0 0 10px)"
            mask="url('#selection')"
          />
          <mask id="selection">
            <rect
              :width="(element?.node.rect.width + 40) * scale"
              :height="(element?.node.rect.height + 40) * scale"
              fill="white"
            />
            <SvgElement
              v-bind="element?.shapeSvg"
              stroke="currentColor"
              :stroke-width="2 / scale"
              fill="black"
            />
          </mask>
        </g>
      </g>
    </svg> -->
  </div>
</template>

<script lang="ts">
import EditorInstance from '@/renderer/models/editor/EditorInstance'
import Rect from '@/renderer/models/nodes/Rect'
import { useRuntime } from '@/renderer/store'
import interact from 'interactjs'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { roundDecimalPlaces } from '../../utils/math'

export default defineComponent({
  props: {
    elementId: String,
    scale: Number,
    posX: Number,
    posY: Number,
    editor: Object
  },

  setup (props) {
    const editor_ = ref(props.editor as EditorInstance | null)
    const runtime = useRuntime()

    const element = computed(() => runtime.tabs[editor_.value?.id ?? -1]?.registeredElements[props.elementId!])
    const elements = computed(() => Object.values(runtime.tabs[editor_.value?.id ?? -1]?.registeredElements ?? {})
      .filter((x: any) => editor_.value?.state.selection.selection.includes(x.id)))

    const move = ref(null as HTMLElement | null)
    const edgeN = ref(null as HTMLElement | null)
    const edgeE = ref(null as HTMLElement | null)
    const edgeS = ref(null as HTMLElement | null)
    const edgeW = ref(null as HTMLElement | null)
    const cornerNe = ref(null as HTMLElement | null)
    const cornerSe = ref(null as HTMLElement | null)
    const cornerSw = ref(null as HTMLElement | null)
    const cornerNw = ref(null as HTMLElement | null)

    const moving = ref(false)
    const resizeingN = ref(false)
    const resizeingE = ref(false)
    const resizeingS = ref(false)
    const resizeingW = ref(false)

    onMounted(() => {
      const modifierElements = {
        move,
        edgeN,
        edgeE,
        edgeS,
        edgeW,
        cornerNe,
        cornerSe,
        cornerSw,
        cornerNw
      } as {[x: string]: any}

      // console.log(modifierElements)

      Object.keys(modifierElements).forEach(x => {
        const el = modifierElements[x]

        let startRects: Rect[]
        let startPosX: number
        let startPosY: number

        /* var interaction = */ interact(el.value)
          .styleCursor(false)
          .draggable({
            // hold: x === 'move',
            autoScroll: true,
            listeners: {
              start () {
                runtime.movingElement = true

                startRects = elements.value.map(x => ({
                  x: x.boundingBox.x,
                  y: x.boundingBox.y,
                  width: x.boundingBox.width,
                  height: x.boundingBox.height
                }))

                startPosX = props.posX ?? 0
                startPosY = props.posY ?? 0

                switch (x) {
                  case 'move': move(); break
                  case 'edgeN': resizeN(); break
                  case 'edgeE': resizeE(); break
                  case 'edgeS': resizeS(); break
                  case 'edgeW': resizeW(); break
                  case 'cornerNe': resizeN(); resizeE(); break
                  case 'cornerSe': resizeS(); resizeE(); break
                  case 'cornerSw': resizeS(); resizeW(); break
                  case 'cornerNw': resizeN(); resizeW(); break
                }

                function move () { moving.value = true }
                function resizeN () { resizeingN.value = true }
                function resizeE () { resizeingE.value = true }
                function resizeS () { resizeingS.value = true }
                function resizeW () { resizeingW.value = true }
              },
              move (e: any) {
                const clientDelta = {
                  x: (e.clientX - e.clientX0) / (props.scale ?? 1) + (startPosX - (props.posX ?? 0)) / (props.scale ?? 1),
                  y: (e.clientY - e.clientY0) / (props.scale ?? 1) + (startPosY - (props.posY ?? 0)) / (props.scale ?? 1)
                }

                switch (x) {
                  case 'move': move(); break
                  case 'edgeN': resizeN(); break
                  case 'edgeE': resizeE(); break
                  case 'edgeS': resizeS(); break
                  case 'edgeW': resizeW(); break
                  case 'cornerNe': resizeN(); resizeE(); break
                  case 'cornerSe': resizeS(); resizeE(); break
                  case 'cornerSw': resizeS(); resizeW(); break
                  case 'cornerNw': resizeN(); resizeW(); break
                }

                function move () {
                  elements.value.forEach((el, i) => {
                    el.setBoundingBox({
                      x: Math.round(startRects[i].x + clientDelta.x),
                      y: Math.round(startRects[i].y + clientDelta.y)
                    })
                  })
                }

                function resizeN () {
                  elements.value.forEach((el, i) => {
                    el.setBoundingBox({
                      y: Math.ceil(Math.min(startRects[i].y + startRects[i].height!, startRects[i].y + clientDelta.y)),
                      height: Math.floor(Math.max(0, startRects[i].height! - clientDelta.y))
                    })
                  })
                }
                function resizeE () {
                  elements.value.forEach((el, i) => {
                    el.setBoundingBox({ width: Math.floor(Math.max(0, startRects[i].width! + clientDelta.x)) })
                  })
                }
                function resizeS () {
                  elements.value.forEach((el, i) => {
                    el.setBoundingBox({ height: Math.floor(Math.max(0, startRects[i].height! + clientDelta.y)) })
                  })
                }
                function resizeW () {
                  elements.value.forEach((el, i) => {
                    el.setBoundingBox({
                      x: Math.ceil(Math.min(startRects[i].x + startRects[i].width!, startRects[i].x + clientDelta.x)),
                      width: Math.floor(Math.max(0, startRects[i].width! - clientDelta.x))
                    })
                  })
                }
              },
              end () {
                runtime.movingElement = false

                moving.value = false
                resizeingN.value = false
                resizeingE.value = false
                resizeingS.value = false
                resizeingW.value = false
              }
            }
          }).on('tap', () => {
            if (editor_.value) {
              editor_.value.state.selection.editing = props.elementId ?? null
            }
          })
      })
    })

    return {
      editor_,
      element,
      elements,

      move,
      edgeN,
      edgeE,
      edgeS,
      edgeW,
      cornerNe,
      cornerSe,
      cornerSw,
      cornerNw,

      moving,
      resizeingN,
      resizeingE,
      resizeingS,
      resizeingW,

      roundDecimalPlaces
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.selection-box {
  position: absolute;
  touch-action: none;

  &__size-text {
    position: absolute;
    font-size: .75rem;

    background: r.$col-selection;
    color: r.$col-white;
    border-radius: 5px;

    &--width {
      padding: 0 5px;
      inset: calc(100% + 5px) auto auto 50%;
      transform: translateX(-50%);
    }
    &--height {
      inset: 50% auto auto calc(100% + 5px);
      transform: translateY(-50%)rotate(180deg);

      padding: 5px 0;

      writing-mode: vertical-lr;
      text-orientation: mixed;
    }
  }

  &__handles {
    position: absolute;
    inset: 0;
    transition: inset .2s;

    border: r.$col-selection solid 1px;
    margin: -1px;
  }

  &__fill {
    position: absolute;
    inset: 0;

    pointer-events: all;
  }

  &__corner {
    position: absolute;
    width: 9px;
    height: 9px;

    pointer-events: all;

    background: r.$col-white;
    border: r.$col-selection solid 1px;
    border-radius: 50%;

    $inset: -4px;

    &--ne { inset: $inset $inset auto auto; cursor: ne-resize;}
    &--se { inset: auto $inset $inset auto; cursor: se-resize;}
    &--sw { inset: auto auto $inset $inset; cursor: sw-resize;}
    &--nw { inset: $inset auto auto $inset; cursor: nw-resize;}
  }

  &__edge {
    position: absolute;

    transition: background .2s;
    pointer-events: all;

    // .moving & {
    //   background: rgba(r.$col-primary, 0.2);
    // }

    $inset: -4px;
    &--n {
      height: 9px;
      inset: $inset 0 auto 0;
      cursor: n-resize;

      // .resizeing-n & {
      //   background: rgba(r.$col-primary, 0.4);
      // }
    }
    &--e {
      width: 9px;
      inset: 0 $inset 0 auto;
      cursor: e-resize;

      // .resizeing-e & {
      //   background: rgba(r.$col-primary, 0.4);
      // }
    }
    &--s {
      height: 9px;
      inset: auto 0 $inset 0;
      cursor: s-resize;

      // .resizeing-s & {
      //   background: rgba(r.$col-primary, 0.4);
      // }
    }
    &--w {
      width: 9px;
      inset: 0 auto 0 $inset;
      cursor: w-resize;

      // .resizeing-w & {
      //   background: rgba(r.$col-primary, 0.4);
      // }
    }
  }

  svg {
    display: block;
    color: r.$col-selection;
    transform-origin: 0 0;

    .moving & > g {
      filter: drop-shadow(black 0 0 2);
    }
  }
}
</style>
