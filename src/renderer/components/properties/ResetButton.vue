<template>
  <button class="reset-btn">
    <bi i="arrow-counterclockwise" />
  </button>
</template>

<style lang="scss" scoped>
@use '../../scss' as r;

.reset-btn {
  @include r.buttonReset;
  color: r.$col-warning;

  cursor: pointer;
}
</style>
