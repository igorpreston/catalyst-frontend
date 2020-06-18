<template>
  <header class="bb b--purple-gray top-header pa2 pl4 z-5">
    <div class="flex items-center">
      <div class="mr3">
        <miso-button-link
          :href="backUrl"
          type="transparent"
          class="mid-gray">
          <feather-icon
            name="x"
            color="mid-gray"
            width="20"
            height="20"/>
        </miso-button-link>
      </div>
      <div class="flex-auto flex items-center overflow-hidden bl b--purple-gray">
        <div class="pl4 flex-auto">
          <transition
            :bind-css="false"
            mode="out-in"
            name="taskName"
            @enter="fadeInRight"
            @leave="fadeOutLeft">
            <div>
              <miso-heading
                level="3"
                class="mv0 f5 truncate">{{ taskType }}
                <span v-if="task && task.contact">
                  {{ task.contact.full_name }}
                  at
                  {{ task.account.name }}
                </span>
                <span v-else-if="task && task.account">
                  {{ task.account.name }}
                </span>
              </miso-heading>
              <ul class="mb0 mt1 list pl0 f6 mid-gray dotted flex">
                <li
                  v-if="taskDueTime"
                  class="flex mr3">Due on {{ taskDueDate }} at {{ taskDueTime }}</li>
                <li
                  v-else
                  class="flex mr3">Due on {{ taskDueDate }}</li>
                <span class="flex mt1 mr3 light-gray-accent f8">&bull;</span>
                <li
                  :class="taskPriorityColor"
                  class="flex m">
                  <feather-icon
                    :color="taskPriorityColor"
                    width="16"
                    height="16"
                    name="info"
                    class="mr1"/>
                  {{ taskPriority }} Priority
                </li>
              </ul>
            </div>
          </transition>
        </div>
      </div>
      <div>
        <div class="ph3 flex items-center">
          <miso-button
            :disabled="isThereNoPrevTask"
            size="small"
            class="mid-gray"
            type="transparent"
            @click="moveToPrevTask">
            <feather-icon
              color="color-inherit"
              name="arrow-left"
              width="18"
              height="18"/>
          </miso-button>
          <p class="mv0 mh2 mid-gray">
            {{ currentTask }}
          </p>
          <miso-button
            :disabled="isThereNoNextTask"
            size="small"
            class="mid-gray"
            type="transparent"
            @click="moveToNextTask">
            <feather-icon
              color="color-inherit"
              name="arrow-right"
              width="18"
              height="18"/>
          </miso-button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import moment from 'moment-timezone'

import { mapActions, mapState, mapGetters } from 'vuex'

import transitions from '#/packs/transitions'

import {
  MisoButton,
  MisoButtonLink,
  MisoHeading,
  FeatherIcon
} from 'miso'

export default {
  name: 'TasksReviewHeader',

  components: {
    MisoButton,
    MisoButtonLink,
    MisoHeading,
    FeatherIcon
  },

  mixins: [
    transitions
  ],

  computed: {
    ...mapState({
      task: state => state.tasks.task,
      backUrl: state => state.tasks.reviewBackUrl,
      currentUser: state => state.auth.currentUser
    }),

    ...mapGetters([
      'reviewNum',
      'reviewIndex',
      'isThereNoPrevTask',
      'isThereNoNextTask'
    ]),

    currentTask () {
      return `${this.reviewIndex + 1} of ${this.reviewNum}`
    },

    taskPriority () {
      return this.task && this.task.priority_text
    },

    taskPriorityColor () {
      return this.task && this.task.priority ? 'red' : 'green'
    },

    taskType () {
      return this.task && this.task.category_text
    },

    taskDueDate () {
      return this.task &&
        this.task.due && moment.tz(this.task.due,
        (this.currentUser && this.currentUser.time_zone) || 'UTC')
        .format('MM/DD/YYYY')
    },

    taskDueTime () {
      if (!this.task || !this.task.due) {
        return false
      }

      const due = this.task.due && moment.tz(this.task.due,
        (this.currentUser && this.currentUser.time_zone) || 'UTC')

      return due.format('h:mm A')
    }
  },

  methods: {
    ...mapActions(['nextTask', 'prevTask']),

    moveToNextTask () {
      this.nextTask()
    },

    moveToPrevTask () {
      this.prevTask()
    }
  }
}
</script>

<style scoped>
  .top-header {
    background: #fff;
  }
</style>
