<template>
  <div class="flex flex-0 flex-column">
    <div class="flex flex-auto">
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
        data-cy="condition-type"
        @clear="onClearConditionType">
        <miso-option
          v-for="type in contactConditionTypes"
          :key="type.name"
          :label="type.name"
          :value="type.value"/>
      </miso-select>

      <component
        v-if="condition.type"
        :parent-condition="condition"
        :parent-index="index"
        :is="parentCondition.parent"
        metrics-scope="contact"/>
    </div>

    <div class="flex flex-auto">
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

import PlaybooksConditionContactEvent from './playbooks-condition-contact-event'
import PlaybooksConditionContactSegment from './playbooks-condition-contact-segment'
import PlaybooksConditionContactField from './playbooks-condition-contact-field'
import PlaybooksConditionEntitySuccessMetric from './playbooks-condition-entity-success-metric'

export default {
  name: 'PlaybooksConditionContact',

  inject: {
    $validator: '$validator'
  },

  components: {
    MisoBadge,
    MisoOption,
    MisoSelect,
    PlaybooksConditionContactEvent,
    PlaybooksConditionContactSegment,
    PlaybooksConditionContactField,
    PlaybooksConditionEntitySuccessMetric
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
      contactConditionTypes: [
        {
          name: 'Success Metric', value: 'success_metric', parent: 'playbooks-condition-entity-success-metric'
        },
        {
          name: 'Performs an event', value: 'event', parent: 'playbooks-condition-contact-event'
        },
        {
          name: 'Segment', value: 'segment', parent: 'playbooks-condition-contact-segment'
        },
        {
          name: 'Field', value: 'field', parent: 'playbooks-condition-contact-field'
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
        return _.find(this.contactConditionTypes, { value: this.condition.type })
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
