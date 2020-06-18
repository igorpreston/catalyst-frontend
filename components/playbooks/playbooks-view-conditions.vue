<template>
  <div class="flex flex-column">
    <h2 class="ttu mid-gray playbooks-view__heading">Conditions</h2>

    <div class="flex flex-column f6">
      <div
        v-for="(condition, index) in conditions"
        :key="condition.field"
        class="flex flex-auto condition">
        <div class="flex items-center fw5 condition__statement">{{ index === 0 ? 'If' : 'and if' }}</div>

        <div
          class="flex items-center condition__description">
          <div class="mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            {{ object }}
          </div>
        </div>

        <div
          v-if="condition.field == null"
          class="flex items-center condition__description">
          <div class="mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            {{ formatType(condition.type) }}
          </div>
        </div>

        <div
          v-if="condition.event && condition.type === 'event' "
          class="flex items-center condition__description">
          <div class="mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            performs {{ condition.event }}
          </div>
        </div>

        <div
          v-if="condition.type === 'success_metric' "
          class="flex items-center condition__description">
          <div class="mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            {{ getMetricsNameById(condition.metric) }}
          </div>
        </div>

        <div
          v-if="condition.times && condition.type !== 'success_metric'"
          class="flex items-center condition__description">
          <div class="mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            {{ condition.times + ' time' + (condition.times === '1' ? '' : 's') }}
          </div>
        </div>

        <div
          v-if="condition.field"
          class="flex items-center condition__description">
          <div class="mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            {{ condition.field === 'owner_id' ? 'owner' : condition.field }}
          </div>
        </div>

        <div class="flex items-center condition__description">
          <div class="mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            {{ formatOperator(condition.field, condition.type, condition.operator) }}
          </div>
        </div>

        <div
          v-if="condition.times && condition.type === 'success_metric'"
          class="flex items-center condition__description">
          <div class="mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            {{ condition.times }}
          </div>
        </div>

        <div
          v-if="lastConditionItem(condition)"
          class="flex items-center condition__description">
          <div class="mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            {{ lastConditionItem(condition) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'

import { mapGetters, mapState } from 'vuex'

export default {
  name: 'PlaybooksViewConditions',

  props: {
    conditions: {
      type: Array,
      default: () => []
    },
    object: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      serviceFields: [
        {
          field: 'title',
          humanizedName: 'title',
          type: 'string',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            },
            {
              name: 'blank',
              label: 'is blank'
            },
            {
              name: 'present',
              label: 'is present'
            }
          ]
        },
        {
          field: 'phone',
          humanizedName: 'phone',
          type: 'string',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            },
            {
              name: 'blank',
              label: 'is blank'
            },
            {
              name: 'present',
              label: 'is present'
            }
          ]
        },
        {
          field: 'email',
          humanizedName: 'email',
          type: 'string',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            },
            {
              name: 'blank',
              label: 'is blank'
            },
            {
              name: 'present',
              label: 'is present'
            }
          ]
        },
        {
          field: 'time_zone',
          humanizedName: 'time zone',
          type: 'string',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            },
            {
              name: 'blank',
              label: 'is blank'
            },
            {
              name: 'present',
              label: 'is present'
            }
          ]
        },
        {
          field: 'first_name',
          humanizedName: 'first name',
          type: 'string',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            },
            {
              name: 'blank',
              label: 'is blank'
            },
            {
              name: 'present',
              label: 'is present'
            }
          ]
        },
        {
          field: 'last_name',
          humanizedName: 'last name',
          type: 'string',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            },
            {
              name: 'blank',
              label: 'is blank'
            },
            {
              name: 'present',
              label: 'is present'
            }
          ]
        },
        {
          field: 'address',
          humanizedName: 'address',
          type: 'text',
          operators: [
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            }
          ]
        },
        {
          field: 'name',
          humanizedName: 'name',
          type: 'string',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            },
            {
              name: 'blank',
              label: 'is blank'
            },
            {
              name: 'present',
              label: 'is present'
            }
          ]
        },
        {
          field: 'stage',
          humanizedName: 'stage',
          type: 'string',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            },
            {
              name: 'blank',
              label: 'is blank'
            },
            {
              name: 'present',
              label: 'is present'
            }
          ]
        },
        {
          field: 'starred',
          humanizedName: 'starred',
          type: 'boolean',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            }
          ]
        },
        {
          field: 'renewal_date',
          humanizedName: 'renewal date',
          type: 'date',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'less_than',
              label: 'is less than'
            },
            {
              name: 'greater_than',
              label: 'is greater than'
            }
          ]
        },
        {
          field: 'description',
          humanizedName: 'description',
          type: 'text',
          operators: [
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            }
          ]
        },
        {
          field: 'contract_value',
          humanizedName: 'contract value',
          type: 'integer',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'less_than',
              label: 'is less than'
            },
            {
              name: 'greater_than',
              label: 'is greater than'
            }
          ]
        },
        {
          field: 'size',
          humanizedName: 'size',
          type: 'integer',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'less_than',
              label: 'is less than'
            },
            {
              name: 'greater_than',
              label: 'is greater than'
            }
          ]
        },
        {
          field: 'industry',
          humanizedName: 'industry',
          type: 'string',
          operators: [
            {
              name: 'equal',
              label: 'equals'
            },
            {
              name: 'not_equal',
              label: 'does not equal'
            },
            {
              name: 'cont',
              label: 'contains'
            },
            {
              name: 'not_cont',
              label: 'does not contain'
            },
            {
              name: 'blank',
              label: 'is blank'
            },
            {
              name: 'present',
              label: 'is present'
            }
          ]
        },
        {
          field: 'segment',
          humanizedName: 'segment',
          type: 'string',
          operators: [
            {
              name: 'is_in',
              label: 'is in'
            },
            {
              name: 'is_not_in',
              label: 'is not in'
            },
            {
              name: 'has_left',
              label: 'has left'
            },
            {
              name: 'has_entered',
              label: 'has entered'
            }
          ]
        },
        {
          field: 'last_activity',
          humanizedName: 'last activity',
          type: 'string',
          operators: [
            {
              name: 'more_than',
              label: 'more than'
            },
            {
              name: 'less_than',
              label: 'less than'
            },
            {
              name: 'equal_to',
              label: 'equal to'
            },
            {
              name: 'not_equal_to',
              label: 'not equal to'
            }
          ]
        },
        {
          field: 'success_metric',
          humanizedName: 'success metric',
          type: 'string',
          operators: [
            {
              name: 'more_than',
              label: 'more than'
            },
            {
              name: 'less_than',
              label: 'less than'
            },
            {
              name: 'equal_to',
              label: 'equal to'
            },
            {
              name: 'not_equal_to',
              label: 'not equal to'
            }
          ]
        },
        {
          field: 'event',
          humanizedName: 'event',
          type: 'string',
          operators: [
            {
              name: 'more_than',
              label: 'more than'
            },
            {
              name: 'less_than',
              label: 'less than'
            },
            {
              name: 'equal_to',
              label: 'equal to'
            },
            {
              name: 'not_equal_to',
              label: 'not equal to'
            }
          ]
        },
        {
          field: 'owner_id',
          humanizedName: 'owner',
          type: 'field',
          operators: [
            {
              name: 'equal',
              label: 'is'
            },
            {
              name: 'not_equal',
              label: 'is not'
            }
          ]
        }
      ]
    }
  },

  computed: {
    ...mapGetters(['getSegmentNameById', 'getMetricsNameById']),
    ...mapState({
      currentUser: state => state.auth.currentUser,
      salesforceUsers: state => state.salesforceUsers
    })
  },

  methods: {
    lastConditionItem (condition) {
      if (condition.type === 'last_activity') {
        return moment.tz(condition.value, (this.currentUser &&
          this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
      } else if (condition.type === 'event') {
        return 'in the last ' + condition.days + ' days'
      } else if (condition.type === 'success_metric') {
        return 'in the last ' + condition.days + ' days'
      } else if (condition.segment_id) {
        return this.getSegmentNameById(condition.segment_id)
      } else if (condition.field === 'owner_id') {
        return this.salesforceUsers.all.find(salesforceUser =>
          salesforceUser.id === condition.value).full_name
      } else if (condition.value) {
        return condition.value
      } else {
        return ''
      }
    },

    formatOperator (fieldName, type, operatorValue) {
      const field = this.serviceFields.find(
        field => (field.field === fieldName || field.field === type)
      )
      const operator = field.operators.find(
        operator => operator.name === operatorValue)
      return operator.label
    },

    formatType (type) {
      const field = this.serviceFields.find(
        field => field.field === type
      )
      return field.humanizedName
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
