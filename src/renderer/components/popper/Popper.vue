<template>
  <div
    ref="target"
    class="popper-target"
    v-bind="$attrs"
  >
    <slot />

    <teleport to="#layer">
      <transition name="popper">
        <div
          ref="popup"
          :class="['popper', {
            'popper--tooltip': type === 'tooltip',
            'popper--popup': type === 'popup'
          }]"
          v-show="!disabled && showPopup"
          role="tooltip"
        >
          <div class="popper__container">
            <slot name="content" />
          </div>
          <div
            class="popper__arrow"
            data-popper-arrow
          />
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, onUpdated, ref, watch } from 'vue'
import { createPopper, Instance, Placement } from '@popperjs/core'
import getElementPath from '@/renderer/utils/getElementPath'

declare var window: {
  tooltipDelayPassed: boolean
  tooltipOpen: boolean
}

export default defineComponent({
  props: {
    type: { type: String, default: () => 'tooltip' },
    placement: { type: String, default: () => 'auto' },
    disabled: Boolean
  },

  methods: {
    show () {
      this.showPopup = true
    },
    hide () {
      this.showPopup = false
    },
    toggle () {
      this.showPopup = !this.showPopup
    }
  },

  setup (props, { slots }) {
    const popup = ref(null as HTMLElement | null)

    // get the first DOM element in slot
    const target = ref(null as HTMLElement | null)

    const showPopup = ref(false)

    onMounted(() => {
      setPopper()

      switch (props.type) {
        case 'tooltip':
          // Open Popup when hovering target

          var tooltipShowEvents = ['mouseenter', 'focusin']
          var tooltipHideEvents = ['mouseleave', 'focusout']

          var timeout: number

          // Open Tooltip after a delay
          // Open instantly if cursor was on a tooltip 300ms before
          tooltipShowEvents.forEach(event => {
            target.value!.addEventListener(event, () => {
              timeout = setTimeout(() => {
                window.tooltipDelayPassed = true
                window.tooltipOpen = true

                showPopup.value = true
              }, window.tooltipDelayPassed || event === 'focusin' ? 0 : 500)
            })
          })

          tooltipHideEvents.forEach(event => {
            target.value!.addEventListener(event, (e) => {
              if (event === 'focusout' &&
                (e as any).relatedTarget &&
                getElementPath((e as any).relatedTarget).includes(target.value!)) {
                return
              }

              clearTimeout(timeout)
              window.tooltipOpen = false

              setTimeout(() => {
                if (!window.tooltipOpen) {
                  window.tooltipDelayPassed = false
                }
              }, 300)

              showPopup.value = false
            })
          })
          break
        case 'popup':
          // Open Popup when show() is called
          // Close Popup when hide() is called or clicked outside Popup

          var popupHideEvents = ['click']

          popupHideEvents.forEach(event => {
            document.addEventListener(event, popupClose)
          })

          onUnmounted(() => {
            popupHideEvents.forEach(event => {
              document.removeEventListener(event, popupClose)
            })
          })
          break
      }
    })

    function popupClose (e: Event) {
      if (showPopup.value) {
        // Close Popup when clicked outside popup
        if (!getElementPath(e.target as Element).find(x => x === popup.value! || x === target.value!)) {
          showPopup.value = false
        }
      }
    }

    watch(showPopup, () => {
      popper && popper.update()
    })
    onUpdated(() => {
      popper && popper.update()
    })

    var popper: Instance | null
    function setPopper () {
      popper = createPopper(target.value!, popup.value!, {
        placement: props.placement as Placement,
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 6]
            }
          }
        ]
      })
    }

    return {
      popup,
      target,
      showPopup
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.popper {
  z-index: 1;

  $arrow-size: 5px;

  &__container {
    padding: 5px 10px;
    border-radius: 5px;

    @include r.light {
      background: r.$col-white;
      color: r.$col-800;
      filter: drop-shadow(0px 5px 10px #0002);
    }
    @include r.dark {
      background: r.$col-900;
      color: r.$col-white;
      filter: drop-shadow(0px 5px 10px #0003);
    }
  }

  &--tooltip {
    .popper__container {
      text-align: center;
      max-width: 500px;
      width: fit-content;
      font-size: 12px;
    }
  }
  &--popup {
    .popper__container {
      pointer-events: all;
    }
  }

  &__arrow {
    position: absolute;
    width: $arrow-size * 2;
    height: $arrow-size * 2;

    @include r.light {
      border: r.$col-white solid $arrow-size;
    }
    @include r.dark {
      border: r.$col-900 solid $arrow-size;
    }
  }

  &[data-popper-placement^='top'] > .popper__arrow {
    bottom: -$arrow-size * 2;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
  }

  &[data-popper-placement^='bottom'] > .popper__arrow {
    top: -$arrow-size * 2;
    border-top-color: transparent;
    border-right-color: transparent;
    border-left-color: transparent;
  }

  &[data-popper-placement^='left'] > .popper__arrow {
    right: -$arrow-size * 2;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }

  &[data-popper-placement^='right'] > .popper__arrow {
    left: -$arrow-size * 2;
    border-top-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
  }

  &-enter-active, &-leave-active {
    transition: opacity .15s;

    .popper__container {
      transition: transform .15s;
    }
  }
  &-enter-from, &-leave-to {
    opacity: 0;

    &[data-popper-placement^='top'] > .popper__container {
      transform: translateY(5px);
    }
    &[data-popper-placement^='bottom'] > .popper__container {
      transform: translateY(-5px);
    }
    &[data-popper-placement^='left'] > .popper__container {
      transform: translateX(5px);
    }
    &[data-popper-placement^='right'] > .popper__container {
      transform: translateX(-5px);
    }
  }
}
</style>
