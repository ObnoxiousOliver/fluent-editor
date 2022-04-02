<template>
  <div
    :class="['viewer-header-btn', {
      'viewer-header-btn--active': active,
      'viewer-header-btn--multiple': multiple
    }]"
  >
    <button
      @click="$emit('button:click')"
      class="viewer-header-btn__button"
    >
      <div class="viewer-header-btn__button__content">
        <slot />
      </div>
    </button>
    <button
      v-if="multiple"
      @click="$emit('arrow:click')"
      class="viewer-header-btn__arrow"
    >
      <div class="viewer-header-btn__arrow__content">
        <oi
          class="viewer-header-btn__arrow__icon"
          i="chevron-small-down"
        />
      </div>
    </button>
  </div>
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
  display: grid;
  grid-auto-flow: column;

  &__button {
    @include r.buttonReset;
    padding: 5px 2.5px;

    cursor: pointer;

    @include r.light {
      color: r.$col-400;
    }
    @include r.dark {
      color: r.$col-300;
    }

    &__content {
      width: 30px;
    }
  }

  &__button, &__arrow {
    &__content {
      display: grid;
      place-content: center;

      height: 100%;
      border-radius: 5px;

      transition: color .2s, background .2s;
    }
  }

  &__arrow {
    @include r.buttonReset;

    cursor: pointer;

    @include r.light {
      color: r.$col-400;
    }
    @include r.dark {
      color: r.$col-300;
    }

    transition: color .2s, background .2s;
    padding: 5px 2.5px 5px 0;

    &__icon {
      transition: transform .2s;
    }

    &__content {
      border-radius: 0 5px 5px 0;
      padding-left: 2px;
      padding-right: 5px;
    }

    &:hover {
      .viewer-header-btn__arrow__icon {
        transform: translateY(2px);
      }
    }
  }

  &:hover:not(.viewer-header-btn--active) {
    .viewer-header-btn {
      &__button__content, &__arrow__content {
        @include r.light {
          background: r.$col-400;
          color: r.$col-800;
        }
        @include r.dark {
          background: r.$col-600;
          color: r.$col-white;
        }
      }
    }
  }

  &--active {
    .viewer-header-btn__button__content,
    .viewer-header-btn__arrow__content {
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
      &__button {
        padding: 5px 0 5px 2.5px;

        &__content {
          width: auto;
          padding-left: 5px;
          border-radius: 5px 0 0 5px;
        }
      }
    }
  }
}
</style>
