<template>
  <div
    v-loading="isLoadingTasks"
    class="flex flex-auto flex-column w-50 ba b--light-gray br2 mr24">
    <miso-heading
      level="3"
      class="mv0 bb b--light-gray f6 fw5 bg-off-purple stats__heading">
      Recent Tasks
    </miso-heading>

    <div
      v-if="tasks.all.length"
      class="flex flex-auto flex-column overflow-y-hidden stats__tasks">
      <div class="flex flex-auto flex-column f6 overflow-y-auto">
        <div
          v-for="task in tasks.all"
          :key="task.id"
          class="pointer bb b--light-gray stats__task"
          @click="onTaskClick">
          <div class="flex flex-auto items-center mid-gray">
            <span
              :class="getColorWithStatus(task.is_completed)['icon_bg_color']"
              class="flex mv0 ph2 pv1 br4 ba">
              <feather-icon
                :stroke-width="2.5"
                :name="iconType(task.category)"
                :color="getColorWithStatus(task.is_completed)['icon_color']"
                width="10"
                height="10"/>
              <feather-icon
                v-if="task.playbook"
                :stroke-width="2.5"
                :color="getColorWithStatus(task.is_completed)['icon_color']"
                width="10"
                height="10"
                name="book-open"
                class="ml2" />
            </span>
            <span class="mh2 light-gray">|</span>
            <span
              :class="getColorWithStatus(task.is_completed)['text_color']"
              class="ma0 truncate two-lines">
              <span>{{ taskType(task.category) }} </span>
              <span v-if="taskType(task.category) === 'To-Do'">for </span>
              <span
                v-if="task.contact_full_name"
                class="fw5">
                {{ task.contact_full_name }}
              </span>
              <span v-if="task.contact_full_name">@ </span>
              <span class="fw5">{{ task.account_name }} </span>
            </span>
          </div>

          <div class="flex flex-auto flex-column mt1">
            <p
              :class="getColorWithStatus(task.is_completed)['desp_color']"
              class="ma0 truncate">
              <span
                v-if="task.playbook"
                class="fw5">Step {{ step.number }}:
              </span>

              {{ task.description }}
            </p>

            <p
              :class="getColorWithStatus(task.is_completed)['desp_color']"
              class="mt2 mb0">
              Due on {{ convertDue(task.due) }} - {{ task.priority_text }} priority
              <span
                v-if="task.priority"
                class="f7 red">
                &bull;
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <miso-empty
      v-else
      class="flex-auto pa24 stats--empty"
      heading="No Tasks"
      body="You're good to go!">
      <div class="flex justify-center">
        <span
          class="mb2 br-100 ba b--light-gray bg-off-white stats--empty__icon">
          <feather-icon
            :stroke-width="1.5"
            width="18"
            height="18"
            name="check-square"
            color="mid-gray" />
        </span>
      </div>
    </miso-empty>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import moment from 'moment-timezone'

import {
  FeatherIcon,
  MisoHeading,
  MisoEmpty
} from 'miso'

export default {
  name: 'AccountsDetailTabsOverviewStatsTasks',

  components: {
    FeatherIcon,
    MisoHeading,
    MisoEmpty
  },

  computed: {
    ...mapState({
      tasks: state => state.tasks,
      currentUser: state => state.auth.currentUser,
      isLoadingTasks: state => state.tasks.isLoadingTasks
    }),

    ...mapGetters([
      'getColorWithStatus'
    ])
  },

  methods: {
    ...mapActions(['changeTab', 'updateFilter']),

    taskType (type) {
      switch (type) {
        case 'call':
          return 'Call'
        case 'email':
          return 'Email'
        default:
          return 'To-Do'
      }
    },

    tooltipText (type) {
      return `This task is ${this.taskType(type) === 'Email' ? 'an' : 'a'} ${this.taskType} within a playbook`
    },

    iconType (type) {
      switch (type) {
        case 'call':
          return 'file'
        case 'email':
          return 'mail'
        default:
          return 'check'
      }
    },

    convertDue (due) {
      return moment.tz(due, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    },

    onTaskClick () {
      // this.updateFilter({field: 'status', value: [false]})
      this.changeTab('tasks')
    }
  }
}
</script>
