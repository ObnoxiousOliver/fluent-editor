<template>
  <i :class="'bi-' + i" />
</template>

<script>
export default {
  props: {
    i: String
  }
}
</script>
