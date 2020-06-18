<template>
  <div class="mb3">
    <miso-label class="mid-gray db mb2">{{ label }}</miso-label>
    <p>
      <miso-badge
        v-show="errors.has(label)"
        size="tiny"
        color="red">
        {{ errors.first(label) }}
      </miso-badge>
    </p>
    <div class="mt2">
      <miso-input
        v-validate.disable="validationRule"
        v-if="isEditing"
        v-model="computedValue"
        :data-vv-name="label"
        class="white f6"/>
      <p
        v-else
        class="mv0 f6">
        {{ value }}
      </p>
    </div>
  </div>
</template>

<script>
import {
  MisoBadge,
  MisoInput,
  MisoLabel
} from 'miso'

export default {
  name: 'ContactsDetailTabsOverviewInfoInlineFormTextInput',

  components: {
    MisoBadge,
    MisoInput,
    MisoLabel
  },

  inject: {
    $validator: '$validator'
  },

  props: {
    label: {
      type: String,
      default: null
    },
    value: {
      type: [String, Number],
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    validationRule: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      tempValue: null
    }
  },

  computed: {
    computedValue: {
      get () {
        return this.tempValue
      },
      set (value) {
        this.tempValue = value
        this.$emit('input', value)
      }
    }
  },

  watch: {
    value: function () {
      this.tempValue = this.value
    }
  },

  created () {
    this.tempValue = this.value
  }
}
</script>
