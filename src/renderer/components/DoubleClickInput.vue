<template>
  <span
    class="dbclick-input"
    ref="root"
  >
    {{ focused ? '' : value || placeholder }}
    <span
      v-if="focused"
      class="input-sizer"
      :data-value="value"
    >
      <input
        ref="input"

        v-model="value"
        @blur="focused = false"
        @keydown.enter="focused = false"

        class="dbclick-input__input"
        type="text"
        spellcheck="false"
        autocomplete="false"
      >
    </span>
  </span>
</template>

<script lang="ts">
import interact from 'interactjs'
import { defineComponent, onMounted, ref, watch } from 'vue'

export default defineComponent({
  emits: [
    'update:modelValue'
  ],
  props: {
    modelValue: String,
    placeholder: String
  },

  setup (props, { emit }) {
    const root = ref(null as HTMLElement | null)
    const input = ref(null as HTMLInputElement | null)

    const value = ref(props.modelValue)

    watch(value, val => emit('update:modelValue', val))

    const focused = ref(false)

    onMounted(() => {
      interact(root.value!)
        .on('doubletap', (e) => {
          if (!focused.value) {
            focused.value = true
            setTimeout(() => {
              input.value!.focus()
              input.value!.select()
            })
          }
        })
    })

    return {
      root,
      input,
      value,
      focused
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.dbclick-input {
  cursor: pointer;

  &__input {
    @include r.buttonReset;

    line-height: inherit;

    &:focus {
      outline: none;
    }
  }
}

.input-sizer {
  display: inline-grid;
  vertical-align: top;
  align-items: center;
  position: relative;

  @include r.light {
    background: r.$col-white;
    color: r.$col-black;
  }
  @include r.dark {
    background: r.$col-600;
    color: r.$col-white;
  }

  border: r.$col-primary solid 1px;
  padding: 2px;
  margin: -3px;

  &::after {
    content: attr(data-value) '';
    visibility: hidden;
    white-space: nowrap;
  }

  input, &::after {
    width: auto;
    min-width: 1em;
    grid-area: 1/2;
    resize: none;
  }
}
</style>
