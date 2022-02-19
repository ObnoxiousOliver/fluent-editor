<template>
  <div class="number-item">
    <ResetButton />
    <div class="number-item__label">
      {{ $t(item.name) }}
    </div>
    <FluentNumberInput
      class="number-item__input"
      v-model="value"
      :unit="item.unit"
      :nullable="item.nullable"
      :dragRatio="item.dragRatio"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import ResetButton from '../ResetButton.vue'

export default defineComponent({
  components: {
    ResetButton
  },
  props: {
    item: Object
  },

  setup (props) {
    const value = ref(props.item?.value ?? null)

    watch(() => props.item?.value, val => {
      value.value = val ?? null
    }, { deep: true })
    watch(value, val => {
      props.item && props.item.set(val)
    }, { deep: true })

    return {
      value
    }
  }
})
</script>

<style lang="scss" scoped>
@use '../../../scss' as r;

.number-item {
  display: flex;
  gap: 10px;

  &__label {
    flex: 1 1 auto;
    width: 0;

    @include r.light {
      color: r.$col-400;
    }
    @include r.dark {
      color: r.$col-300;
    }
  }
  &__input {
    // flex: 1 1 auto;
    width: 300px;

    .vertical-group > .number-item > & {
      width: 100px;
    }
  }
}
</style>
