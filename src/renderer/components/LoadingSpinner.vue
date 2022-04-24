<template>
  <div class="loading-spinner">
    <div />
    <div />
    <div />
    <div />
    <div />
    <div />
  </div>
</template>

<style lang="scss" scoped>
@use '../scss' as r;
@use 'sass:math';

$size: 40px;
$dot-size: 5px;
$dot-spacing: 15deg;

.loading-spinner {
  display: inline-block;
  position: relative;
  width: $size;
  height: $size;

  div {
    animation: spinner 1.2s cubic-bezier(0.21, 0.71, 0.86, 0.31) infinite;
    transform-origin: ($size / 2) ($size / 2);

    &::after {
      content: " ";
      display: block;
      position: absolute;
      width: $dot-size;
      height: $dot-size;
      border-radius: 50%;
      background: currentColor;
      margin: (-$dot-size / 2) 0 0 (-$dot-size / 2);
    }

    @for $i from 1 through 6 {
      &:nth-child(#{$i}) {
        animation-delay: #{$i * 0.05}s;

        &::after {
          transform: translate(
            math.sin(($i - 1) * $dot-spacing - $dot-spacing * 3) * $size / 2 + $size / 2,
            math.cos(($i - 1) * $dot-spacing - $dot-spacing * 3) * $size / 2 + $size / 2
          );
        }
      }
    }
  }

}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
