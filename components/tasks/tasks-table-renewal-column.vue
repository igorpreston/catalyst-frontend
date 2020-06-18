<template>
  <p
    :class="getColorWithStatus(isCompleted)['text_color']"
    class="mv0 truncate">
    {{ renewalDate }}
  </p>
</template>

<script>
import moment from 'moment-timezone'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'TasksTableRenewalColumn',

  props: {
    renewal: {
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

    renewalDate () {
      if (!this.renewal) return
      return moment.tz(this.renewal, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    }
  }
}
</script>
