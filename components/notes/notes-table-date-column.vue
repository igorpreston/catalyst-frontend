<template>
  <p class="mv0 truncate">{{ formattedDate }}</p>
</template>

<script>
import moment from 'moment-timezone'
import { mapState } from 'vuex'

export default {
  name: 'NotesTableDateColumn',

  props: {
    date: {
      type: String,
      default: null
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    }),

    formattedDate () {
      return moment.tz(this.date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    }
  }
}
</script>
