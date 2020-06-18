<template>
  <div
    :class="isSelected"
    @click="onItemClick">
    <div class="mid-gray z-1 activity__time">{{ toTimeInTimeZone(activity.when) }}</div>

    <div class="bg-white z-1 activity__circle">
      <feather-icon
        name="check-square"
        width="15"
        height="15"
        color="mid-gray-accent"/>
    </div>

    <div
      class="activity__text">
      <p
        class="mt0 activity__title">
        {{ action }} {{ listTitle }}
      </p>

      <p
        class="ma0 mb1 flex items-center activity__description">
        {{ description | capitalize }}
      </p>

      <p class="ma0 flex items-center activity__description">
        <span
          :class="priorityClass"
          class="flex mr2 f7">
          &bull;
        </span>
        {{ details }}
      </p>
    </div>

    <feather-icon
      name="arrow-right"
      width="19"
      height="19"
      color="purple"
      class="ml-auto activity__arrow"/>
  </div>
</template>

<script>
import { FeatherIcon } from 'miso'
import moment from 'moment-timezone'
import { mapState } from 'vuex'
import { itemView } from '../mixins/item-view'

export default {
  name: 'ActivityListItemTask',

  components: {
    FeatherIcon
  },

  mixins: [itemView],

  props: {
    activity: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: String,
      default: null
    },
    onSelectListItem: {
      type: Function,
      default () {}
    },
    currentlySelectedItem: {
      type: Object,
      default: () => ({})
    },
    onOpenedItem: {
      type: Function,
      default () {}
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    }),

    listTitle () {
      let str = this.activity.changes === '' ? '' : `${this.activity.changes} for`
      if (this.activity.verb === 'created') {
        str = `${str} ${this.activity.resource.category_text === 'Email' ? 'an' : 'a'}`
      } else {
        str = `${str} the`
      }

      str = `${str} ${this.activity.resource.category_text} task for `

      if (this.hasContact) {
        str = `${str} ${this.activity.owner.full_name} @`
      }

      return `${str} ${this.activity.resource.account.name}`
    },

    description () {
      if (!this.activity.resource || !this.activity.resource.description) {
        return ''
      }
      return `${this.activity.resource.description}`
    },

    details () {
      if (this.activity.resource.due) {
        return `Due on ${this.parseDate(this.activity.resource.due)} and priority is ${this.activity.resource.priority_text}`
      } else {
        return `Priority is ${this.activity.resource.priority_text}`
      }
    },

    isSelected () {
      if (this.currentlySelectedItem === null) {
        return false
      } else if (this.activity.id === this.currentlySelectedItem.id) {
        return 'selected'
      }

      return false
    },

    priorityClass () {
      return this.activity.resource.priority ? 'red' : 'green'
    }
  },

  methods: {
    onItemClick () {
      this.onOpenedItem('task')
      this.onSelectListItem(this.activity)
    },

    parseDate (date) {
      if (date == null) {
        return
      }
      return moment.tz(date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    }
  }
}
</script>
