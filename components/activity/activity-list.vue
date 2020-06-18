<template>
  <div
    class="flex flex-auto flex-column el-col-0">
    <activity-list-item
      v-for="activity in activities.all"
      :key="toDateInTimeZone(activity.date)"
      :date="toDateInTimeZone(activity.date)"
      :activities="activity.list"
      :is-opened="true"
      :currently-selected-item="currentlySelectedItem"
      :on-select-list-item="onSelectListItem"
      :on-opened-item="onOpenedItem"/>
  </div>
</template>

<script>
import ActivityListItem from '#/components/activity/activity-list-item'
import _ from 'lodash'
import _inflector from 'lodash-inflection'
import moment from 'moment-timezone'
import { mapState } from 'vuex'
_.mixin(_inflector)

export default {
  name: 'ActivityList',

  components: {
    ActivityListItem
  },

  props: {
    onOpenedItem: {
      type: Function,
      default () {}
    },
    onSelectListItem: {
      type: Function,
      default () {}
    },
    currentlySelectedItem: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    ...mapState({
      activities: state => state.activities
    })
  },

  methods: {
    toDateInTimeZone (datetime) {
      return moment.tz(datetime, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    }
  }
}
</script>
