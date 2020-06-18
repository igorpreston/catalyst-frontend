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
        <span v-if="filterValue === 'currency'">
          {{ computedValue | currency }}
        </span>
        <span v-else>
          {{ computedValue }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import {
  MisoBadge,
  MisoLabel,
  MisoInput
} from 'miso'

export default {
  name: 'AccountsDetailTabsOverviewInfoInlineFormTextInput',

  components: {
    MisoBadge,
    MisoLabel,
    MisoInput
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
      type: [Number, String],
      default: null
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    validationRule: {
      type: String,
      default: ''
    },
    filterValue: {
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
        return this.tempValue && this.tempValue.toString()
      },
      set (value) {
        if (this.filterValue === 'currency') {
          const roundedValue = (Math.floor(value * 100) / 100).toFixed(2) * 100
          this.tempValue = value
          this.$emit('input', roundedValue)
        } else {
          this.tempValue = value
          this.$emit('input', value)
        }
      }
    }
  },

  watch: {
    value: function () {
      if (this.filterValue === 'currency') {
        this.tempValue = Math.floor(this.value) / 100
      } else {
        this.tempValue = this.value
      }
    }
  },

  created () {
    if (this.filterValue === 'currency') {
      this.tempValue = Math.floor(this.value) / 100
    } else {
      this.tempValue = this.value
    }
  }
}
</script>
