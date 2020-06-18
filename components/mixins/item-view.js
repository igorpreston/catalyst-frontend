import moment from 'moment-timezone'
import { mapState } from 'vuex'

export const itemView = {
  props: {
    activity: {
      type: Object,
      default: () => []
    },
    isOverview: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    }),

    description () {
      switch (this.activity.type) {
        case 'Campaign':
          return this.activity.resource.body
        case 'Note':
          return this.activity.resource.content_plain
        default:
          return this.activity.resource.description
      }
    },

    createdDate () {
      return this.parseTime(this.activity.resource.created_at || this.activity.when)
    },

    updatedDate () {
      return this.parseTime(this.activity.resource.updated_at)
    },

    contact () {
      return this.activity.owner.full_name
    },

    contactUrl () {
      return `/contacts/${this.activity.owner.id}`
    },

    hasContact () {
      return this.activity.owner_type === 'Contact'
    },

    action () {
      if (this.activity.verb) {
        return `${this.activity.actor} ${this.activity.verb}`
      }
    }
  },

  methods: {
    parseTime (datetime) {
      return moment.tz(datetime, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YY @ h:mm a')
    },

    toTimeInTimeZone (datetime) {
      const format = (this.isOverview ? 'MM/D/YY [at] ' : '') + 'h:mm A'
      return moment.tz(datetime, (this.currentUser && this.currentUser.time_zone) || 'UTC').format(format)
    }
  }
}
