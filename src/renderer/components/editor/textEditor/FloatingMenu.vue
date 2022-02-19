<template>
  <div class="floating-menu">
    <button
      tabindex="-1"
      :class="$bem('floating-menu__btn', 'bold')"
      @click="click('bold')"
    >
      B
    </button>
    <button
      tabindex="-1"
      :class="$bem('floating-menu__btn', 'italic')"
      @click="click('italic')"
    >
      I
    </button>
    <button
      tabindex="-1"
      :class="$bem('floating-menu__btn', 'underline')"
      @click="click('underline')"
    >
      U
    </button>
    <button
      tabindex="-1"
      :class="$bem('floating-menu__btn', 'strike')"
      @click="click('strike')"
    >
      S
    </button>
    <button
      tabindex="-1"
      :class="$bem('floating-menu__btn', 'sup')"
      @click="click('sup')"
    >
      x<sup>2</sup>
    </button>
    <button
      tabindex="-1"
      :class="$bem('floating-menu__btn', 'sub')"
      @click="click('sub')"
    >
      x<sub>2</sub>
    </button>
  </div>
</template>

<script lang="ts">
import { Editor } from '@tiptap/vue-3'
import { defineComponent } from 'vue'

declare var window: {
  activeTiptapEditor: any
}

export default defineComponent({
  setup () {
    function click (button: string) {
      if (!window.activeTiptapEditor!) return

      var chain = (window.activeTiptapEditor as Editor).chain().focus()

      switch (button) {
        case 'bold':
          chain = chain.toggleBold()
          break
        case 'italic':
          chain = chain.toggleItalic()
          break
        case 'underline':
          // chain = chain.toggleUnderline()
          break
        case 'strike':
          chain = chain.toggleStrike()
          break
      }

      chain.run()
    }

    return {
      click
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../../scss' as r;

.floating-menu {
  position: absolute;
  inset: auto auto calc(100% + 5px) 0;
  white-space: nowrap;

  display: flex;

  border-radius: 5px;
  @include r.light {
    background: r.$col-50;
    border: r.$bg-mod-black solid 1px;
  }
  @include r.dark {
    background: r.$col-700;
    border: r.$bg-mod-white solid 1px;
  }

  overflow: hidden;

  &__btn {
    @include r.buttonReset;

    font-family: r.$type-serif;
    font-size: 1.2rem;

    width: 34px;
    height: 34px;

    cursor: pointer;
    pointer-events: all;

    transition: .1s background;

    &:hover {
      @include r.light {
        background: r.$col-100;
      }
      @include r.dark {
        background: r.$col-500;
      }
    }

    sup, sub {
      display: inline-block;
      vertical-align: baseline;
      color: r.$col-primary;
      font-size: .9rem;
    }

    sup {
      transform: translateY(-5px);
    }
    sub {
      transform: translateY(4px);
    }

    &--bold {
      font-weight: bold;
    }
    &--italic {
      font-style: italic;
    }
    &--underline {
      text-decoration: underline 1px;
    }
    &--strike {
      text-decoration: line-through;
    }
  }
}
</style>
