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

      <miso-select
        v-validate.disable="'required'"
        v-if="selectedOperatorIsNotEmpty"
        :data-vv-name="parentIndex + '_condition_segment'"
        v-model="chosenSegment"
        clearable
        filterable
        class="mr2 white-select"
        placeholder="Select Segment"
        variant="white"
        data-vv-as="segment">
        <miso-option
          v-for="item in accountSegments"
          :key="item.id"
          :label="item.name"
          :value="item.id"/>
      </miso-select>
    </div>
    <p>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_triggerOperator')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_triggerOperator') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(parentIndex + '_condition_segment')"
        size="tiny"
        color="red">
        {{ errors.first(parentIndex + '_condition_segment') }}
      </miso-badge>
    </p>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import _ from 'lodash'

import {
  MisoBadge,
  MisoInput,
  MisoOption,
  MisoSelect
} from 'miso'

export default {
  name: 'PlaybooksConditionAccountSegment',

  components: {
    MisoBadge,
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
      selectedSegment: '',
      triggerOperators: [
        {
          name: 'is in', value: 'is_in'
        },
        {
          name: 'is not in', value: 'is_not_in'
        },
        {
          name: 'has left', value: 'has_left'
        },
        {
          name: 'has entered', value: 'has_entered'
        }
      ]
    }
  },

  computed: {
    ...mapGetters(['accountSegments']),

    triggerOperator: {
      get () {
        return this.parentCondition.operator || this.selectedOperator
      },

      set (value) {
        this.selectedOperator = value
        this.updateType('operator', value)
      }
    },

    chosenSegment: {
      get () {
        return this.parentCondition.segment_id || this.selectedSegment
      },

      set (value) {
        this.selectedSegment = value
        this.updateType('segment_id', value)
      }
    },

    selectedOperatorIsNotEmpty () {
      return !_.isEmpty(this.triggerOperator)
    }
  },

  watch: {
    triggerOperator () {
      if (this.chosenSegment) {
        this.filterMembers()
      }
    },

    chosenSegment () {
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
      this.selectedSegment = ''
      this.updateType('operator', null)
      this.updateType('segment_id', null)
      this.filterMembers()
    }
  }
}
</script>
