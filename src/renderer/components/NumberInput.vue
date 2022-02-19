<template>
  <FluentInput
    :class="{
      'input-field--number': true
    }"
    ref="root"
    v-model="inputValue"
    @input:blur="submit(true)"
    @input:focus="inputValue = inputValue ? inputValue : ''"
    @keydown.enter="submit()"
    @keydown.esc="cancel()"
    @keydown.up="increase"
    @keydown.down="decrease"
    :selectAllOnFocus="true"
    :placeholder="inputValue === null ? (isAuto ? $t('input.auto') : (isArray ? $t('input.mixed') : '')) : '' "
  >
    <template
      v-if="$slots.default"
      #before
    >
      <slot />
    </template>
    <template
      v-if="inputValue !== null"
      #after
    >
      {{ unit }}
    </template>
  </FluentInput>
</template>

<script lang="ts">
import interact from 'interactjs'
import keycode from 'keycode'
import { evaluate } from 'mathjs'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { NumberValueType } from '../models/nodes/properties/NumberInput'
import { useActions } from '../store'
import { ignoreKey, pressedKeys } from '../utils/keybindManager'
import { roundDecimalPlaces } from '../utils/math'

export default defineComponent({
  emit: ['update:modelValue'],
  props: {
    unit: String,
    nullable: Boolean,
    dragRatio: Number,
    modelValue: [Number, Array]
  },

  setup (props, { emit }) {
    const root = ref()

    const { t } = useI18n()

    const value = ref(null as NumberValueType)
    watch(() => props.modelValue, val => {
      value.value = val as NumberValueType
    }, { deep: true })
    watch(value, val => {
      if (Array.isArray(val) && val.length <= 1) {
        value.value = val[0] ?? null
      }

      emit('update:modelValue', val)
      setInputValue(val)
    }, { deep: true })
    onMounted(() => { value.value = props.modelValue as NumberValueType })

    const inputValue = ref(null as string | null)

    setInputValue(props.modelValue as NumberValueType)

    function setInputValue (val: NumberValueType) {
      if (Array.isArray(val) && val.length <= 1) {
        val = val[0] ?? null
      }

      inputValue.value = Array.isArray(val)
        ? t('input.mixed')
        : (typeof (val) === 'number' || !props.nullable
          ? '' + (val ?? '')
          : null)
    }

    function submit (blured: boolean) {
      root.value.blur()

      try {
        if (!inputValue.value) throw Error

        var result = evaluate(inputValue.value.replaceAll(',', '.'))
        if (typeof (result) === 'number' && !Number.isNaN(result)) {
          inputValue.value = '' + result
          value.value = result
          return
        }
      } catch {}

      if (props.nullable && !blured) {
        inputValue.value = null
        value.value = null
      } else cancel()
    }

    function cancel () {
      setInputValue(value.value)
    }

    const isAuto = computed(() => !value.value)
    const isArray = computed(() => Array.isArray(value.value))

    // Arrow Keys
    function increase (e: KeyboardEvent) {
      manipulateValue(x => x !== null ? x + (e.shiftKey ? 10 : 1) : null)
      setTimeout(() => root.value.input.select())
    }
    function decrease (e: KeyboardEvent) {
      manipulateValue(x => x !== null ? x - (e.shiftKey ? 10 : 1) : null)
      setTimeout(() => root.value.input.select())
    }

    // Drag
    onMounted(() => {
      if (root.value?.$el) {
        var startNumber: NumberValueType | undefined
        var shiftKey: boolean
        // var altKey: boolean

        interact(root.value.$el)
          .styleCursor(false)
          .draggable({
            ignoreFrom: 'input',
            lockAxis: 'x',
            listeners: {
              start (e) {
                startNumber = value.value
                useActions().cursor = 'ew-resize'

                ignoreKey(keycode('shift'))
              },
              move (e) {
                var deltaX = Math.round((e.clientX - e.clientX0) / (props.dragRatio ?? 5))

                if (shiftKey !== pressedKeys[keycode('shift')]) {
                  shiftKey = !!pressedKeys[keycode('shift')]

                  if (typeof (startNumber) === 'number') {
                    startNumber = shiftKey ? startNumber - (deltaX * 10 - deltaX) : startNumber + (deltaX * 10 - deltaX)
                  } else if (Array.isArray(startNumber)) {
                    startNumber = startNumber.map(x => x !== null ? (shiftKey ? x - (deltaX * 10 - deltaX) : x + (deltaX * 10 - deltaX)) : null)
                  }
                }

                if (shiftKey) {
                  deltaX *= 10
                }

                if (Array.isArray(startNumber)) {
                  value.value = startNumber.map(x => x !== null ? roundDecimalPlaces(x + deltaX, 1) : null)
                } else if (typeof (startNumber) === 'number') {
                  value.value = startNumber !== null ? roundDecimalPlaces(startNumber + deltaX, 1) : null
                }
              },
              end (e) {
                startNumber = undefined
                useActions().cursor = null
                ignoreKey(keycode('shift'), false)
              }
            }
          })
      }
    })

    function manipulateValue (cb: (x: number | null) => number | null) {
      if (Array.isArray(value.value)) {
        value.value = value.value.map(cb)
      } else if (typeof (value.value) === 'number') {
        value.value = cb(value.value)
      }
    }

    return {
      root,
      value,
      inputValue,
      submit,
      cancel,
      isAuto,
      isArray,
      increase,
      decrease
    }
  }
})
</script>
