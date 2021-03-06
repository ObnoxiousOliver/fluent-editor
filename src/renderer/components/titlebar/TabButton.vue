<template>
  <div
    :class="['tab-btn', {
      'tab-btn--active': active,
      'tab-btn--home': isHome
    }]"
    ref="root"
  >
    <button
      @click="$emit('focusTab')"
      class="tab-btn__name"
    >
      <slot />
    </button>
    <button
      v-if="!isHome"
      @click="$emit('closeTab')"
      :class="['tab-btn__close', {
        'tab-btn__close--unsaved': unsaved
      }]"
    >
      <svg
        v-if="unsaved"
        class="tab-btn__close__circle"
        width="10"
        height="12"
        viewbox="0 0 12"
      >
        <circle
          fill="currentColor"
          cx="5"
          cy="5"
          r="5"
        />
      </svg>
      <bi
        class="tab-btn__close__x"
        i="x"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/runtime-core'

export default defineComponent({
  emits: [
    'focusTab',
    'closeTab'
  ],
  props: {
    active: Boolean,
    isHome: Boolean,
    unsaved: Boolean
  },

  setup (props) {
    const root = ref(null as HTMLElement | null)

    watch(() => props.active, () => {
      if (root.value) {
        root.value.scrollIntoView()
      }
    })

    return {
      root
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.tab-btn {
  position: relative;

  max-width: 160px;
  min-width: 100px;
  font-size: 14px;

  padding: 2px 0 0;

  flex: 1 1 0;
  width: 0;

  transition: background .1s, color .1s;
  cursor: pointer;

  // border-right: r.$col-500 solid 1px;

  -webkit-app-region: no-drag;
  color: r.$col-200;

  &:where(:hover) {
    background: r.$col-600;
    color: r.$col-white;
  }

  &--active {
    background: r.$col-700;
    color: r.$col-white;
  }

  &--home {
    $width: 40px;

    flex: 0 0 $width;
    width: $width;
    min-width: unset;

    .tab-btn__name {
      text-align: center;
      width: $width;
      padding: 0;
    }
  }

  &__name {
    @include r.buttonReset;
    cursor: pointer;

    padding: 0 40px 0 1rem;
    height: 100%;
    width: 100%;

    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

  }

  &__close {
    @include r.buttonReset;
    cursor: pointer;

    position: absolute;
    inset: 0 0 0 auto;

    width: 23px;
    height: 23px;
    margin: auto 6px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 50%;

    color: r.$col-200;
    font-size: 1.2rem;

    transition: background .1s, color .1s;

    [class^="bi"]::before {
      vertical-align: -.15em;
    }

    &:hover {
      background: r.$col-500;
      color: r.$col-white;
    }

    &--unsaved {
      color: r.$col-white;

      .tab-btn__close__x {
        display: none;
      }

      &:hover {
        .tab-btn__close__x {
          display: block;
        }
        .tab-btn__close__circle {
          display: none;
        }
      }
    }
  }
}
</style>
