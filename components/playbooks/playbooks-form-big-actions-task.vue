<template>
  <div class="flex flex-0 flex-column">
    <div class="flex flex-auto mb2">
      <div class="flex flex-0 relative action__select">

        <feather-icon
          v-if="taskIcon"
          :name="taskIcon"
          width="16"
          height="16"
          class="absolute z-1 task__icon"/>

        <miso-select
          v-validate.disable="'required'"
          :class="{ 'selected' : taskIcon }"
          :data-vv-name="index + '_action_taskType'"
          v-model="taskType"
          clearable
          filterable
          class="mr2 white-select"
          placeholder="Select Task Type"
          variant="white"
          data-vv-as="task type"
          data-cy="task-type"
          @change="changeIcon"
          @clear="onClearTaskType">
          <miso-option
            v-for="item in taskTypes"
            :key="item.value"
            :label="item.name"
            :value="item.value">
            <div
              class="flex flex-auto">
              <feather-icon
                :name="item.icon"
                width="16"
                height="16"
                class="mr3"/>
              {{ item.name }}
            </div>
          </miso-option>
        </miso-select>
      </div>

      <div
        v-if="selectedTaskTypeIsNotEmpty"
        class="flex flex-auto items-center">
        <div class="ml3 mr2">
          Due
        </div>

        <miso-input
          v-validate.disable="'required'"
          :data-vv-name="index + '_action_days'"
          v-model="days"
          type="number"
          variant="white"
          placeholder="1"
          class="mr2 task__days"
          data-vv-as="days"
          data-cy="days"/>
        <div class="mr2">
          days after trigger and priority
        </div>
      </div>
    </div>

    <div
      v-if="selectedTaskTypeIsNotEmpty"
      class="flex flex-auto">
      <miso-select
        v-validate.disable="'required'"
        :data-vv-name="index + '_action_priority'"
        v-model="priority"
        clearable
        filterable
        class="mr2 white-select task__priority"
        placeholder="High"
        variant="white"
        data-vv-as="priority"
        data-cy="priority">
        <miso-option
          v-for="item in priorities"
          :key="item.value"
          :label="item.name"
          :value="item.value"/>
      </miso-select>

      <miso-select
        v-validate.disable="'required'"
        :data-vv-name="index + '_action_owner'"
        v-model="owner"
        filterable
        clearable
        data-vv-as="owner"
        data-cy="owner"
        value-key="id"
        class="mb3 task__owner"
        placeholder="Owner">
        <miso-option
          v-for="user in alteredUsers"
          :key="user.id"
          :value="user"
          :label="user.name"/>
      </miso-select>

      <miso-input
        :data-vv-name="index + '_action_description'"
        v-model="description"
        variant="white"
        placeholder="A great description..."
        class="mb4 task__description"
        data-vv-as="description"/>
    </div>
    <p>
      <miso-badge
        v-show="errors.has(index + '_action_taskType')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_action_taskType') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(index + '_action_days')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_action_days') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(index + '_action_priority')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_action_priority') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(index + '_action_description')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_action_description') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(index + '_action_owner')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_action_owner') }}
      </miso-badge>
    </p>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions, mapState } from 'vuex'
import _ from 'lodash'

import {
  MisoInput,
  MisoBadge,
  MisoSelect,
  MisoOption,
  MisoButton,
  FeatherIcon
} from 'miso'

export default {
  name: 'PlaybooksFormBigActionsTask',

  components: {
    MisoInput,
    MisoBadge,
    MisoSelect,
    MisoOption,
    MisoButton,
    FeatherIcon
  },

  inject: {
    $validator: '$validator'
  },

  props: {
    action: {
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
      selectedTaskType: '',
      selectedDays: '',
      selectedPriority: '',
      selectedDescription: '',
      selectedOwnerId: '',
      taskIcon: '',
      taskTypes: [
        {
          value: 'email',
          name: 'Email Task',
          icon: 'mail'
        },
        {
          value: 'call',
          name: 'Call/Note Task',
          icon: 'file'
        },
        {
          value: 'to_do',
          name: 'To-Do Task',
          icon: 'check'
        }
      ],
      priorities: [
        {
          value: 'high',
          name: 'High'
        },
        {
          value: 'regular',
          name: 'Regular'
        }
      ]
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser,
      users: state => state.users
    }),

    ...mapGetters(['alteredUsers', 'isJustworks']),

    taskType: {
      get () {
        return this.action.taskType || this.selectedTaskType
      },

      set (value) {
        this.selectedTaskType = value
        this.updateType('taskType', value)
      }
    },

    days: {
      get () {
        return this.action.days || this.selectedDays
      },

      set (value) {
        this.selectedDays = value
        this.updateType('days', value)
      }
    },

    priority: {
      get () {
        return this.action.priority || this.selectedPriority
      },

      set (value) {
        this.selectedPriority = value
        this.updateType('priority', value)
      }
    },

    description: {
      get () {
        return this.action.description || this.selectedDescription
      },

      set (value) {
        this.selectedDescription = value
        this.updateType('description', value)
      }
    },

    owner: {
      get () {
        return this.users.all.find(user => user.id === this.action.owner_id) || this.selectedOwnerId
      },

      set (value) {
        this.selectedOwnerId = value
        this.updateType('owner_id', value.id)
      }
    },

    selectedTaskTypeIsNotEmpty () {
      return !_.isEmpty(this.taskType)
    }
  },

  beforeMount () {
    this.fetchUsers()
    if (!this.isJustworks) {
      this.taskTypes = [
        {
          value: 'call',
          name: 'Call/Note Task',
          icon: 'file'
        },
        {
          value: 'to_do',
          name: 'To-Do Task',
          icon: 'check'
        }
      ]
    }
  },

  methods: {
    ...mapActions(['fetchUsers']),

    ...mapMutations(['setAction']),

    changeIcon (value) {
      let chosenItem = this.taskTypes.filter(function (item) {
        return item.value === value
      })
      this.taskIcon = chosenItem.length ? chosenItem[0].icon : ''
    },

    updateType (key, value) {
      this.setAction({ index: this.index, action: { [key]: value } })
    },

    onClearTaskType () {
      this.taskIcon = ''
      this.selectedDays = ''
      this.selectedPriority = ''
      this.selectedDescription = ''
      this.updateType('days', null)
      this.updateType('priority', null)
      this.updateType('owner_id', null)
      this.updateType('description', null)
    }
  }
}
</script>

<style lang="scss">
  .task {
    &__icon {
      top: 10px;
      left: 8px;
    }

    &__days {
      flex: 0 0 34px;
      .white-input {
        width: 50px;
      }
    }

    &__priority {
      margin-left: -173px;
      .el-input__inner {
        width: 165px;
      }
    }

    &__description {
      .white-input {
        width: 527px;
      }
    }

    &__owner {
      padding-right: 10px;
    }
  }
</style>
