<template>
  <div
    :class="['floating-label-field', {
      'floating-label-field--has-value': value,
    }]"
  >
    <div
      aria-hidden
      class="floating-label-field__label"
    >
      {{ label }}
    </div>
    <input
      :type="type"
      class="floating-label-field__input"
      :aria-label="label"
      v-model="value"
      v-bind="$attrs"
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  emits: [
    'update:modelValue'
  ],

  props: {
    label: String,
    type: { type: String, default: 'text' },
    modelValue: String
  },

  setup (props, { emit }) {
    const value = ref(props.modelValue)

    watch(value, val => {
      emit('update:modelValue', val)
    })

    return {
      value
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.floating-label-field {
  position: relative;

  width: 250px;

  border-radius: 10px;

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

  &:focus-within, &--has-value{
    .floating-label-field {
      &__label {
        transform: translateY(-8px)scale(0.8);
      }
    }
  }

  &__label {
    position: absolute;
    top: 13px;
    left: 15px;
    font-size: 1rem;

    pointer-events: none;

    transform-origin: 0 0;

    transition: transform .4s cubic-bezier(0.19, 1, 0.22, 1);

    @include r.light {
      color: r.$col-400;
    }
    @include r.dark {
      color: r.$col-300;
    }
  }

  &__input {
    @include r.buttonReset;

    width: 100%;

    padding: 19px 5px 6px 15px;

    &:focus {
      outline: none;
    }
  }
}
</style>
