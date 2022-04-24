<template>
  <button
    type="submit"
    class="submit-btn"
  >
    <oi
      i="arrow-right"
      class="submit-btn__arrow submit-btn__arrow--before"
    />
    <span class="submit-btn__text">
      <slot />
    </span>
    <oi
      i="arrow-right"
      class="submit-btn__arrow submit-btn__arrow--after"
    />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {

  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.submit-btn {
  @include r.buttonReset;
  cursor: pointer;

  position: relative;
  overflow: hidden;

  padding: 14px (20px + 10px + 16px) 14px 30px;
  line-height: 1;

  border: r.$col-primary solid 2px;
  border-radius: 10px;

  font-weight: 700;
  color: r.$col-primary;

  transition: .15s;

  &__text {
    display: inline-block;

    transition: transform .5s cubic-bezier(0.19, 1, 0.22, 1);
  }

  &__arrow {
    position: absolute;

    transition: transform .4s cubic-bezier(0.19, 1, 0.22, 1),
      opacity .4s cubic-bezier(0.19, 1, 0.22, 1);

    &--before {
      left: 20px;
      opacity: 0;
      transform: translateX(-30px);
    }
    &--after {
      right: 20px;
      opacity: 1;
      transform: translateX(0);
      transition-delay: .1s;
    }
  }

  &__text, &__arrow {
  }

  &:hover:not(:disabled), &:focus-visible:not(:disabled) {
    outline: none;
    background: r.$col-primary;
    color: r.$col-white;

    .submit-btn {
      &__arrow--before {
        transform: translateX(0);
        opacity: 1;
        transition-delay: .1s;
      }
      &__arrow--after {
        transform: translateX(30px);
        opacity: 0;
        transition-delay: 0s;
      }
      &__text {
        transform: translateX(16px);
      }
    }
  }

  &:hover:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    cursor: default;
  }
}
</style>
