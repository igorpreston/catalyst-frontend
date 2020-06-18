<template>
  <div class="flex flex-0 flex-column">
    <div class="flex flex-auto mb2">
      <miso-select
        v-validate.disable="'required'"
        :data-vv-name="parentIndex + '_action_event'"
        v-model="mixpanelEvent"
        clearable
        filterable
        class="mr2 white-select"
        placeholder="Select Event"
        variant="white"
        data-vv-as="event"
        @clear="onClearMixpanelEvent">
        <miso-option
          v-for="item in eventNames"
          :key="item"
          :label="item"
          :value="item"/>
      </miso-select>

      <miso-select
        v-validate.disable="'required'"
        v-if="selectedEventIsNotEmpty"
        :data-vv-name="parentIndex + '_action_triggerOperator'"
        v-model="triggerOperator"
        clearable
        filterable
        class="mr2 white-select"
        placeholder="Trigger Operator"
        variant="white"
        data-vv-as="trigger operator"
        @clear="onClearTriggerOperator">
        <miso-option
          v-for="type in eventOperators"
          :key="type.value"
          :label="type.name"
          :value="type.value"/>
      </miso-select>

      <div class="next-line flex">
        <miso-input
          v-validate.disable="'required'"
          v-if="selectedOperatorIsNotEmpty && selectedEventIsNotEmpty"
          :data-vv-name="parentIndex + '_action_times'"
          v-model="times"
          variant="white"
          data-vv-as="times"
          placeholder="# times"
          class="mr2"/>

        <miso-input
          v-validate.disable="'required'"
          v-if="selectedOperatorIsNotEmpty && selectedEventIsNotEmpty && selectedTimesIsNotEmpty"
          :data-vv-name="parentIndex + '_action_priority'"
          v-model="days"
          variant="white"
          data-vv-as="priority"
          placeholder="in the last # days"
          class="mr2"/>
      </div>
    </div>
    <p>
      <miso-badge
        v-show="errors.has(parentIndex + '_action_event')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_action_event') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(parentIndex + '_action_triggerOperator')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_action_triggerOperator') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(parentIndex + '_action_times')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_action_times') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(parentIndex + '_action_priority')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_action_priority') }}
      </miso-badge>
    </p>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import _ from 'lodash'

import {
  MisoBadge,
  MisoInput,
  MisoOption,
  MisoSelect
} from 'miso'

import ConditionWatcher from './mixins/playbook-condition-event-watcher'

export default {
  name: 'PlaybooksConditionContactEvent',

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
    }
  },

  data () {
    return {
      eventOperators: [
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
    ...mapState({
      eventNames: state => state.metrics.eventNames
    }),

    mixpanelEvent: {
      get () {
        return this.parentCondition.event
      },

      set (value) {
        this.updateType('event', value)
      }
    },

    triggerOperator: {
      get () {
        return this.parentCondition.operator
      },

      set (value) {
        this.updateType('operator', value)
      }
    },

    times: {
      get () {
        return this.parentCondition.times
      },

      set (value) {
        this.updateType('times', value)
      }
    },

    days: {
      get () {
        return this.parentCondition.days
      },

      set (value) {
        this.updateType('days', value)
      }
    },

    selectedEventIsNotEmpty () {
      return !_.isEmpty(this.mixpanelEvent)
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

    onClearMixpanelEvent () {
      this.updateType('event', null)
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
