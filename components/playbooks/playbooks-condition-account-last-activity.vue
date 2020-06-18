<template>
  <div class="flex flex-0 flex-column">
    <div class="flex flex-auto mb2">
      <miso-select
        v-validate.disable="'required'"
        :data-vv-name="parentIndex + '_condition_triggerOperator'"
        v-model="triggerOperator"
        clearable
        filterable
        class="mr2 white-select"
        placeholder="Trigger Operator"
        variant="white"
        data-vv-as="trigger operator"
        @clear="onClearTriggerOperator">
        <miso-option
          v-for="type in triggerOperators"
          :key="type.value"
          :label="type.name"
          :value="type.value"/>
      </miso-select>

      <miso-date-picker
        v-validate.disable="'required'"
        v-if="selectedOperatorIsNotEmpty"
        :data-vv-name="parentIndex + '_condition_date'"
        v-model="selectedDate"
        type="date"
        placeholder="Pick the last activity date"
        format="MM-dd-yyyy"
        data-vv-as="date"/>
    </div>
    <p>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_triggerOperator')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_triggerOperator') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_date')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_date') }}
      </miso-badge>
    </p>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import { mapMutations, mapActions, mapState } from 'vuex'
import _ from 'lodash'

import {
  MisoBadge,
  MisoDatePicker,
  MisoInput,
  MisoOption,
  MisoSelect
} from 'miso'

export default {
  name: 'PlaybooksConditionAccountLastActivity',

  components: {
    MisoBadge,
    MisoDatePicker,
    MisoInput,
    MisoOption,
    MisoSelect
  },

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
      selectedOperator: '',
      lastActivityDate: '',
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
    ...mapState({
      currentUser: state => state.auth.currentUser
    }),

    triggerOperator: {
      get () {
        return this.parentCondition.operator || this.selectedOperator
      },

      set (value) {
        this.selectedOperator = value
        this.updateType('operator', value)
      }
    },

    selectedDate: {
      get () {
        return this.parentCondition.value || this.lastActivityDate
      },

      set (value) {
        if (value == null) {
          return
        }

        const date = moment.tz(value, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('YYYY-MM-DD')

        this.lastActivityDate = date
        this.updateType('value', date)
      }
    },

    selectedOperatorIsNotEmpty () {
      return !_.isEmpty(this.triggerOperator)
    }
  },

  watch: {
    triggerOperator () {
      if (this.selectedDate) {
        this.filterMembers()
      }
    },

    selectedDate () {
      if (this.triggerOperator) {
        this.filterMembers()
      }
    }
  },

  methods: {
    ...mapMutations(['setCondition']),
    ...mapActions(['filterMembers']),

    updateType (key, value) {
      this.setCondition({ index: this.parentIndex, condition: { [key]: value } })
    },

    onClearTriggerOperator () {
      this.selectedOperator = ''
      this.lastActivityDate = ''
      this.updateType('operator', null)
      this.updateType('date', null)
    }
  }
}
</script>
