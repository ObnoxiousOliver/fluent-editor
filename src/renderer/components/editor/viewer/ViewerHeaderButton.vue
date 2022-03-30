<template>
  <button
    :class="['viewer-header-btn', {
      'viewer-header-btn--active': active,
      'viewer-header-btn--multiple': multiple
    }]"
  >
    <div class="viewer-header-btn__content">
      <slot />
      <div
        v-if="multiple"
        class="viewer-header-btn__arrow"
      >
        <oi i="chevron-small-down" />
      </div>
    </div>
  </button>
</template>

<script lang="ts">
export default {
  props: {
    active: Boolean,
    multiple: Boolean
  }
}
</script>

<style lang="scss" scoped>
@use '../../../scss' as r;

.viewer-header-btn {
  @include r.buttonReset;
  cursor: pointer;

  padding: 5px 2.5px;

  @include r.light {
    color: r.$col-400;
  }
  @include r.dark {
    color: r.$col-300;
  }

  &__content {
    width: 30px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;

    transition: color .2s, background .2s;
  }

  &:hover:not(.viewer-header-btn--active) {
    .viewer-header-btn__content {
      @include r.light {
        background: r.$col-100;
        color: r.$col-800;
      }
      @include r.dark {
        background: r.$col-600;
        color: r.$col-white;
      }
    }
  }
  &:hover:active:not(.viewer-header-btn--active) {
    .viewer-header-btn__content {
      @include r.light {
        background: r.$col-100;
      }
      @include r.dark {
        background: r.$col-800;
      }
    }
  }

  &--active {
    .viewer-header-btn__content {
      @include r.light {
        background: r.$col-100;
        color: r.$col-primary;
      }
      @include r.dark {
        background: r.$col-600;
        color: r.$col-primary;
      }
    }
  }

  &--multiple {
    .viewer-header-btn {
      &__content {
        gap: 2px;
        width: auto;
        padding: 0 5px;
      }
    }
  }
}
</style>
