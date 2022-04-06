<template>
  <div class="input-field">
    <div
      v-if="$slots.before"
      class="input-field__before"
    >
      <slot name="before" />
    </div>
    <input
      class="input-field__input"
      ref="input"
      :type="type"
      v-model="value"
      :placeholder="placeholder"
      @focus="onFocus"
      @blur="$emit('input:blur')"
    >
    <div
      v-if="$slots.after"
      class="input-field__after"
    >
      <slot name="after" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from '@vue/runtime-core'

export default defineComponent({
  emits: ['update:modelValue', 'input:blur', 'input:focus'],
  props: {
    type: { type: String, default: () => 'text' },
    placeholder: String,
    modelValue: String,
    selectAllOnFocus: Boolean
  },

  setup (props, { emit }) {
    const input = ref(null as HTMLInputElement | null)

    const value = ref(props.modelValue)
    watch(() => props.modelValue, val => { value.value = val })
    watch(value, val => { emit('update:modelValue', val) })

    function onFocus () {
      emit('input:focus')

      if (props.selectAllOnFocus) {
        if (input.value) {
          input.value.select()
        }
      }
    }

    function blur () {
      if (input.value) {
        input.value.blur()
      }
    }

    return {
      input,
      onFocus,
      value,
      blur
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.input-field {
  display: inline-flex;
  align-content: center;

  line-height: 1.5;

  gap: 12px;
  padding: 3px 12px;

  border-radius: 5px;

  transition: box-shadow .2s;

  @include r.light {
    background: r.$col-100;
    color: r.$col-900;
  }
  @include r.dark {
    background: r.$col-800;
    color: r.$col-white;
  }

  &:focus-within {
    box-shadow: r.$col-primary 0 0 0 1px, rgba(r.$col-primary, .2) 0 0 0 5px;
  }

  &__before, &__after {
    display: grid;
    place-items: center;

    @include r.light {
      color: r.$col-400;
    }
    @include r.dark {
      color: r.$col-300;
    }
  }

  &__input {
    @include r.buttonReset;

    line-height: inherit;

    flex: 1 1 auto;

    width: 100%;

    &::placeholder {
      @include r.light {
        color: r.$col-400;
      }
      @include r.dark {
        color: r.$col-300;
      }
    }

    &:focus {
      outline: none;
    }
  }

  &--number {
    cursor: ew-resize;
    touch-action: none;
  }
}
</style>
