<template>
  <div class="pa3 pt0 bg-white mb3 overflow-y-auto h-100 flex flex-column justify-between tasks-form">
    <div class="flex items-center justify-between bb b--light-gray fixed z-1 tasks-form__heading">
      <miso-heading
        level="4"
        class="mv0 dark-gray">
        Rescheduling {{ selectedTasksNum }} {{ pluralTaskText }}
      </miso-heading>

      <miso-button
        type="transparent"
        size="small"
        @click="onHideSidePanel">
        <feather-icon
          name="x"
          color="mid-gray"
          height="16"
          width="16"/>
      </miso-button>
    </div>

    <miso-form
      class="tasks-form__form"
      label-position="top"
      @submit.prevent>

      <miso-form-item class="w-100">
        <miso-label>Due Date</miso-label>

        <miso-date-picker
          v-model="dueDate"
          type="date"
          placeholder="e.g 10/13/18"
          format="MM-dd-yyyy"
          class="w-100"
          style="width: 100%;"/>
      </miso-form-item>

      <miso-form-item class="w-100">
        <miso-label>Due Time</miso-label>

        <miso-select
          v-model="dueTime"
          filterable
          value-key="name"
          class="w-100 white-select"
          placeholder="e.g 2pm">
          <miso-option
            v-for="time in dueTimes"
            :key="time.hour"
            :value="time"
            :label="time.name"/>
        </miso-select>
      </miso-form-item>
    </miso-form>

    <div class="flex items-center justify-end fixed bottom-0 pb3 bt b--light-gray tasks-form__footer">
      <miso-button
        class="f6 mr2"
        @click.prevent="onHideSidePanel">
        Cancel
      </miso-button>

      <miso-button
        type="primary"
        class="f6 order-last"
        @click.prevent="saveTasks">
        Save
      </miso-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'

import { mapState, mapActions, mapGetters } from 'vuex'

import {
  MisoHeading,
  MisoButton,
  MisoDatePicker,
  MisoSelect,
  MisoOption,
  MisoForm,
  MisoFormItem,
  MisoMessage,
  MisoLabel,
  FeatherIcon
} from 'miso'

export default {
  name: 'TasksRescheduleForm',

  components: {
    MisoHeading,
    MisoButton,
    MisoDatePicker,
    MisoSelect,
    MisoOption,
    MisoForm,
    MisoFormItem,
    MisoMessage,
    MisoLabel,
    FeatherIcon
  },

  props: {
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    destination: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      dueDate: null,
      dueTime: null,
      dueTimes: [
        { name: '8:00 AM', hour: 8, minute: 0 },
        { name: '8:30 AM', hour: 8, minute: 30 },
        { name: '9:00 AM', hour: 9, minute: 0 },
        { name: '9:30 AM', hour: 9, minute: 30 },
        { name: '10:00 AM', hour: 10, minute: 0 },
        { name: '10:30 AM', hour: 10, minute: 30 },
        { name: '11:00 AM', hour: 11, minute: 0 },
        { name: '11:30 AM', hour: 11, minute: 30 },
        { name: '12:00 PM', hour: 12, minute: 0 },
        { name: '12:30 PM', hour: 12, minute: 30 },
        { name: '1:00 PM', hour: 13, minute: 0 },
        { name: '1:30 PM', hour: 13, minute: 30 },
        { name: '2:00 PM', hour: 14, minute: 0 },
        { name: '2:30 PM', hour: 14, minute: 30 },
        { name: '3:00 PM', hour: 15, minute: 0 },
        { name: '3:30 PM', hour: 15, minute: 30 },
        { name: '4:00 PM', hour: 16, minute: 0 },
        { name: '4:30 PM', hour: 16, minute: 30 },
        { name: '5:00 PM', hour: 17, minute: 0 },
        { name: '5:30 PM', hour: 17, minute: 30 },
        { name: '6:00 PM', hour: 18, minute: 0 }
      ]
    }
  },

  computed: {
    ...mapState({
      account: state => state.accounts.account && state.accounts.account.id,
      contact: state => state.contacts.contact && state.contacts.contact.id,
      currentUser: state => state.auth.currentUser
    }),

    ...mapGetters(['selectedTasksNum']),

    due () {
      if (!this.dueDate) {
        return this.dueDate
      }

      let due = moment(this.dueDate).tz((this.currentUser && this.currentUser.time_zone) || 'UTC').tz('UTC')

      if (this.dueTime) {
        due = due.set({ hour: this.dueTime.hour, minute: this.dueTime.minute })
      }

      return due.toDate()
    },

    pluralTaskText () {
      return this.selectedTasksNum > 1 ? 'Tasks' : 'Task'
    }
  },

  methods: {
    ...mapActions(['rescheduleTasks']),

    saveTasks () {
      const data = {
        task: {
          due: this.due
        }
      }

      this.rescheduleTasks({ data })
        .then(() => {
          MisoMessage.success(`Successfully rescheduled ${this.selectedTasksNum} tasks`)
          this.onHideSidePanel()
        })
        .catch(() => MisoMessage.error(`Failed to reschedule ${this.selectedTasksNum} tasks`))
    }
  }
}
</script>

<style lang="scss">
  .tasks-form {
    &__footer,
    &__heading {
      width: 310px;
      background-color: #fff;
    }

    &__heading {
      padding: 30px 0 22px;
    }

    &__form {
      margin: 90px 0 68px;

      .el-form-item:last-child {
        margin-bottom: 1px;
      }
    }

    .el-textarea__inner {
      padding: 9px 13px;
    }

    &__footer {
      padding-top: 27px;
    }
  }
</style>
