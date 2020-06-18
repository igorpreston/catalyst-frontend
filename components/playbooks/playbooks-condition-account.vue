<template>
  <div class="flex flex-0 flex-column">
    <div class="flex flex-auto mb2">
      <miso-select
        v-validate.disable="'required'"
        :data-vv-name="index + '_condition_conditionType'"
        v-model="conditionType"
        clearable
        filterable
        class="mr2 white-select"
        placeholder="Condition Type"
        variant="white"
        data-vv-as="condition type"
        @clear="onClearConditionType">
        <miso-option
          v-for="type in accountConditionTypes"
          :key="type.name"
          :label="type.name"
          :value="type.value"/>
      </miso-select>

      <component
        v-if="condition.type"
        :parent-condition="condition"
        :parent-index="index"
        :is="parentCondition.parent"
        metrics-scope="account"/>
    </div>

    <div class="flex flex-auto mb2">
      <miso-badge
        v-show="errors.has(index + '_condition_conditionType')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_condition_conditionType') }}
      </miso-badge>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import _ from 'lodash'

import {
  MisoBadge,
  MisoOption,
  MisoSelect
} from 'miso'

import PlaybooksConditionAccountLastActivity from './playbooks-condition-account-last-activity'
import PlaybooksConditionAccountSegment from './playbooks-condition-account-segment'
import PlaybooksConditionAccountField from './playbooks-condition-account-field'
import PlaybooksConditionEntitySuccessMetric from './playbooks-condition-entity-success-metric'

export default {
  name: 'PlaybooksConditionAccount',

  components: {
    MisoBadge,
    MisoOption,
    MisoSelect,
    PlaybooksConditionAccountField,
    PlaybooksConditionAccountLastActivity,
    PlaybooksConditionAccountSegment,
    PlaybooksConditionEntitySuccessMetric
  },

  inject: {
    $validator: '$validator'
  },

  props: {
    condition: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: null
    }
  },

  data () {
    return {
      accountConditionTypes: [
        {
          name: 'Last Activity Date', value: 'last_activity', parent: 'playbooks-condition-account-last-activity'
        },
        {
          name: 'Success Metric', value: 'success_metric', parent: 'playbooks-condition-entity-success-metric'
        },
        {
          name: 'Segment', value: 'segment', parent: 'playbooks-condition-account-segment'
        },
        {
          name: 'Field', value: 'field', parent: 'playbooks-condition-account-field'
        }
      ]
    }
  },

  computed: {
    conditionType: {
      get () {
        return this.condition.type
      },

      set (type) {
        this.updateType(type)
      }
    },

    parentCondition () {
      if (this.condition.type) {
        return _.find(this.accountConditionTypes, { value: this.condition.type })
      }

      return {}
    }
  },

  methods: {
    ...mapActions(['filterMembers']),

    ...mapMutations(['setCondition']),

    updateType (type) {
      this.setCondition({ index: this.index, condition: { type, field: null, operator: null } })
    },

    onClearConditionType () {
      this.setCondition({ index: this.index, condition: {}, replace: true })
      this.filterMembers()
    }
  }
}
</script>

<style lang="scss" scoped>
  .condition {
    flex: 0 0 auto;

    &:not(:last-child) {
      margin-bottom: 8px;
    }

    &__statement {
      flex: 0 0 64px;
      color: #404046;
    }

    &__description {
      flex: 0 0 auto;
    }
  }
</style>
