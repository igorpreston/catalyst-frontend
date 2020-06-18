<template>
  <div class="flex flex-0 flex-column">
    <div class="flex flex-auto mb2">
      <!-- Do not use Salesforce or Zendesk fields for now -->
      <!-- <miso-select
      clearable
      filterable
      class="mr3 white-select"
      v-model="selectedFieldType"
      placeholder="Select Field Type"
      variant="white">
      <miso-option
        v-for="type in fields"
        :label="type.name"
        :value="type.value">
      </miso-option>
    </miso-select> -->

      <miso-select
        v-validate.disable="'required'"
        :data-vv-name="parentIndex + '_condition_selectedFieldName'"
        v-model="selectedFieldName"
        clearable
        filterable
        class="mr2 white-select"
        value-key="field"
        placeholder="Select field"
        variant="white"
        data-vv-as="field name"
        data-cy="field-name"
        @clear="onClearFieldName">
        <miso-option
          v-for="item in serviceFields"
          :key="item.field"
          :label="humanize(item.field)"
          :value="item.field"/>
      </miso-select>

      <miso-select
        v-validate.disable="'required'"
        v-if="selectedFieldNameIsNotEmpty"
        :data-vv-name="parentIndex + '_condition_selectedOperator'"
        v-model="selectedOperator"
        clearable
        filterable
        class="mr2 white-select"
        placeholder="Trigger Operator"
        variant="white"
        data-vv-as="trigger operator"
        data-cy="trigger-operator"
        @clear="onClearTriggerOperator">
        <miso-option
          v-for="type in triggerOperators"
          :key="type.name"
          :label="type.label"
          :value="type.name"/>
      </miso-select>

      <miso-input
        v-validate.disable="'required'"
        v-if="selectedOperatorIsNotEmpty && selectedFieldNameIsNotEmpty && !isBlankOrPresent"
        :data-vv-name="parentIndex + '_condition_selectedValue'"
        :type="formValueType"
        v-model="selectedValue"
        variant="white"
        data-vv-as="trigger value"
        data-cy="trigger-value"
        placeholder="Enter value"
        class="mr2 next-line"/>
    </div>
    <p>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_selectedFieldName')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_selectedFieldName') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_selectedOperator')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_selectedOperator') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_selectedValue')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_selectedValue') }}
      </miso-badge>
    </p>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapMutations, mapActions } from 'vuex'
import { humanizeString } from '../mixins/humanize-string'

import {
  MisoBadge,
  MisoInput,
  MisoOption,
  MisoSelect
} from 'miso'

export default {
  name: 'PlaybooksConditionContactField',

  components: {
    MisoBadge,
    MisoInput,
    MisoOption,
    MisoSelect
  },

  mixins: [humanizeString],

  inject: {
    $validator: '$validator'
  },

  props: {
    parentCondition: {
      type: Object,
      default: () => ({})
    },
    parentIndex: {
      type: Number,
      default: null
    }
  },

  data () {
    return {
      selectedFieldType: null,
      selectedFieldName: null,
      selectedOperator: null,
      selectedValue: null,
      triggerOperators: [],
      fields: [
        {
          name: 'Zendesk', value: 'zendesk'
        },
        {
          name: 'Salesforce', value: 'salesforce'
        }
      ],
      serviceFields: []
    }
  },

  computed: {
    selectedFieldNameIsNotEmpty () {
      return !_.isEmpty(this.selectedFieldName)
    },

    selectedOperatorIsNotEmpty () {
      return !_.isEmpty(this.selectedOperator)
    },

    isBlankOrPresent () {
      return this.selectedOperator === 'blank' || this.selectedOperator === 'present'
    },

    formValueType () {
      return this.selectedFieldType === 'integer' ? 'number' : null
    }
  },

  watch: {
    selectedFieldType (newVal) {
      this.updateType('type', newVal)
    },

    selectedFieldName (newVal, oldVal) {
      if (oldVal) {
        this.selectedOperator = null
        this.selectedValue = null
      }
      this.selectedFieldName = newVal
      let that = this
      this.fetchContactSegmentFields().then(res => {
        that.serviceFields = res.data
        if (newVal) {
          let field = _.find(that.serviceFields,
            serviceField => serviceField.field === newVal)
          that.triggerOperators = field.operators
        }
      })
      this.updateType('field', newVal)
    },

    selectedOperator (newVal, oldVal) {
      if (oldVal) {
        this.selectedValue = null
      }
      this.updateType('operator', newVal)
    },

    selectedValue (newVal) {
      this.updateType('value', newVal)
      if (this.selectedFieldName && this.selectedOperator) {
        this.filterMembers()
      }
    }
  },

  created () {
    let that = this
    this.fetchContactSegmentFields().then(res => {
      that.serviceFields = res.data
      if (that.parentCondition.field) {
        let field = _.find(that.serviceFields,
          serviceField => serviceField.field === that.parentCondition.field)
        that.triggerOperators = field.operators
      }
    })
  },

  beforeMount () {
    this.selectedFieldType = this.parentCondition.type
    this.selectedFieldName = this.parentCondition.field
    this.selectedOperator = this.parentCondition.operator
    this.selectedValue = this.parentCondition.value
  },

  methods: {
    ...mapMutations(['setCondition']),
    ...mapActions(['filterMembers', 'fetchContactSegmentFields']),

    updateType (key, value) {
      this.setCondition({ index: this.parentIndex, condition: { [key]: value } })
    },

    onClearFieldName () {
      this.selectedFieldName = ''
      this.selectedOperator = ''
      this.selectedValue = ''
      this.updateType('field', null)
      this.updateType('operator', null)
      this.updateType('value', null)
      this.filterMembers()
    },

    onClearTriggerOperator () {
      this.selectedOperator = ''
      this.selectedValue = ''
      this.updateType('operator', null)
      this.updateType('value', null)
      this.filterMembers()
    }
  }
}
</script>

<style>
  .next-line {
    margin-top: 44px;
    margin-left: -692px;
  }
</style>
