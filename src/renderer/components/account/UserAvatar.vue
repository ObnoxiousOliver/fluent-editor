<template>
  <button class="user-avatar">
    <div class="user-avatar__circle">
      {{ firstLetter(user?.displayName ?? user?.email ?? '') }}
    </div>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    user: Object
  },

  setup () {
    const firstLetter = (name: string) => {
      return name.charAt(0).toUpperCase()
    }

    return {
      firstLetter
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../scss' as r;

.user-avatar {
  @include r.buttonReset;
  cursor: pointer;

  transition: background .1s, color .1s;

  &:hover {
    background: r.$col-800;
    color: r.$col-white;

    &:active {
      background: r.$col-600;
    }
  }

  &__circle {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    background-color: #519b57;
    color: #fff;

    display: grid;
    place-items: center;
  }
}
</style>
