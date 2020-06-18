<template>
  <div class="flex flex-0 flex-column">
    <div class="flex flex-auto">
      <miso-select
        v-validate.disable="'required'"
        :data-vv-name="parentIndex + '_condition_conditionType'"
        v-model="successMetric"
        clearable
        filterable
        class="mr2 white-select"
        data-vv-as="condition type"
        placeholder="Select Metric"
        variant="white"
        @clear="onClearSuccessMetric">
        <miso-option
          v-for="type in scopedMetrics"
          :label="type.name"
          :key="type.id"
          :value="type.id"/>
      </miso-select>

      <miso-select
        v-validate.disable="'required'"
        v-if="selectedMetricIsNotEmpty"
        :data-vv-name="parentIndex + '_condition_triggerOperator'"
        v-model="triggerOperator"
        clearable
        filterable
        class="mr2 white-select"
        data-vv-as="trigger operator"
        placeholder="Trigger Operator"
        variant="white"
        @clear="onClearTriggerOperator">
        <miso-option
          v-for="type in triggerOperators"
          :key="type.value"
          :label="type.name"
          :value="type.value"/>
      </miso-select>

      <div class="next-line flex">
        <miso-input
          v-validate.disable="'required'"
          v-if="selectedOperatorIsNotEmpty && selectedMetricIsNotEmpty"
          :data-vv-name="parentIndex + '_condition_times'"
          v-model="times"
          data-vv-as="times"
          variant="white"
          placeholder="# times"
          class="mr2"/>

        <miso-input
          v-validate.disable="'required'"
          v-if="selectedOperatorIsNotEmpty  && selectedMetricIsNotEmpty && selectedTimesIsNotEmpty"
          :data-vv-name="parentIndex + '_condition_days'"
          v-model="days"
          data-vv-as="days"
          variant="white"
          placeholder="in the last # days"/>
      </div>
    </div>

    <p>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_conditionType')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_conditionType') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_triggerOperator')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_triggerOperator') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_times')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_times') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_days')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_days') }}
      </miso-badge>
    </p>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
import _ from 'lodash'

import {
  MisoBadge,
  MisoInput,
  MisoOption,
  MisoSelect
} from 'miso'

import ConditionWatcher from './mixins/playbook-condition-event-watcher'

export default {
  name: 'PlaybooksConditionEntitySuccessMetric',

  components: {
    MisoBadge,
    MisoInput,
    MisoOption,
    MisoSelect
  },

  inject: {
    $validator: '$validator'
  },

  mixins: [ ConditionWatcher ],

  props: {
    parentCondition: {
      type: Object,
      default: () => ({})
    },
    parentIndex: {
      type: Number,
      default: null
    },
    metricsScope: {
      type: String,
      default: 'contact'
    }
  },

  data () {
    return {
      triggerOperators: [
        {
          name: 'more than', value: 'more_than'
        },
        {
          name: 'less than', value: 'less_than'
        },
        {
          name: 'equal to', value: 'equal_to'
        },
        {
          name: 'not equal to', value: 'not_equal_to'
        }
      ]
    }
  },

  computed: {
    ...mapGetters(['contactMetrics', 'accountMetrics']),

    scopedMetrics () {
      return this.metricsScope === 'account' ? this.accountMetrics : this.contactMetrics
    },

    successMetric: {
      get () {
        return this.parentCondition.metric || ''
      },

      set (value) {
        this.updateType('metric', value)
      }
    },

    triggerOperator: {
      get () {
        return this.parentCondition.operator || ''
      },

      set (value) {
        this.selectedOperator = value
        this.updateType('operator', value)
      }
    },

    times: {
      get () {
        return this.parentCondition.times || this.selectedTimes
      },

      set (value) {
        this.selectedTimes = value
        this.updateType('times', value)
      }
    },

    days: {
      get () {
        return this.parentCondition.days || this.selectedDays
      },

      set (value) {
        this.selectedDays = value
        this.updateType('days', value)
      }
    },

    selectedMetricIsNotEmpty () {
      return !_.isEmpty(this.successMetric)
    },

    selectedOperatorIsNotEmpty () {
      return !_.isEmpty(this.triggerOperator)
    },

    selectedTimesIsNotEmpty () {
      return !_.isEmpty(this.times)
    }
  },

  methods: {
    ...mapMutations(['setCondition']),
    ...mapActions(['filterMembers']),

    updateType (key, value) {
      this.setCondition({ index: this.parentIndex, condition: { [key]: value } })
    },

    onClearSuccessMetric () {
      this.updateType('metric', null)
      this.updateType('operator', null)
      this.updateType('times', null)
      this.updateType('days', null)
      this.filterMembers()
    },

    onClearTriggerOperator () {
      this.updateType('operator', null)
      this.updateType('times', null)
      this.updateType('days', null)
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
