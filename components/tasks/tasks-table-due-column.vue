<template>
  <div>
    <p
      :class="getColorWithStatus(isCompleted)['text_color']"
      class="mv0 truncate">
      {{ dueDate }} {{ dueTime ? `@ ${dueTime}` : '' }}
    </p>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'TasksTableDueColumn',

  props: {
    due: {
      type: String,
      default: null
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters([
      'getColorWithStatus'
    ]),
    ...mapState({
      currentUser: state => state.auth.currentUser
    }),

    dueDate () {
      return this.due && moment.tz(this.due, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    },
    dueTime () {
      return this.due && moment.tz(this.due, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('hh:mm a')
    }
  }
}
</script>
