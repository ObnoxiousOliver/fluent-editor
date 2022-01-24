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
      :type="type"
      :placeholder="placeholder"
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
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  props: {
    type: { type: String, default: () => 'text' },
    placeholder: String
  }
})
</script>

<style lang="scss" scoped>
@use '../scss' as r;

.input-field {
  display: inline-flex;
  align-content: center;

  line-height: 1.25rem;

  gap: 12px;
  padding: 5px 12px;

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
      @include r.light {
        color: r.$col-400;
      }
      @include r.dark {
        color: r.$col-200;
      }
  }

  &__input {
    @include r.buttonReset;

    flex: 1 1 auto;

    width: 100%;

    &::placeholder {
      @include r.light {
        color: r.$col-400;
      }
      @include r.dark {
        color: r.$col-200;
      }
    }

    &:focus {
      outline: none;
    }
  }
}
</style>
