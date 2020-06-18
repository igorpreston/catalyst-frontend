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
      <miso-select
        v-validate.disable="validationRule"
        v-if="isEditing"
        :data-vv-name="label"
        :data-vv-as="label"
        :multiple="multiple"
        :multiple-limit="multipleLimit"
        :no-data-text="noDataText"
        :value-key="valueKey"
        :label="computedValue"
        v-model="computedValue"
        class="w-100 vanilla-select f6"
        clearable
        filterable>
        <slot name="options"/>
      </miso-select>
      <p
        v-else
        class="mv0 f6">
        No {{ label }} selected
      </p>
    </div>
  </div>
</template>

<script>
import {
  MisoBadge,
  MisoLabel,
  MisoSelect,
  MisoOption
} from 'miso'

export default {
  name: 'AccountsDetailTabsOverviewInfoInlineFormSelectInput',

  components: {
    MisoBadge,
    MisoLabel,
    MisoSelect,
    MisoOption
  },

  inject: {
    $validator: '$validator'
  },

  props: {
    label: {
      type: String,
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Array, Object],
      default: () => []
    },
    isEditing: {
      type: Boolean,
      default: false
    },
    validationRule: {
      type: String,
      default: ''
    },
    noDataText: {
      type: String,
      default: null
    },
    multipleLimit: {
      type: Number,
      default: null
    },
    valueKey: {
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

  beforeMount () {
    if (this.value) {
      this.tempValue = this.value
    }
  }
}
</script>
