<template>
  <div
    v-loading="isLoadingActivities"
    class="flex flex-auto flex-column w-50 ba b--light-gray br2">
    <miso-heading
      level="3"
      class="mv0 bb b--light-gray f6 fw5 bg-off-purple stats__heading">
      Recent Activity
    </miso-heading>

    <div
      v-if="recentActivities.length"
      class="flex flex-auto flex-column ph3 overflow-y-auto"
      @click="onClickTimeline">
      <activity-list-item
        :activities="recentActivities"
        :is-opened="true"
        :is-overview="true"/>
    </div>

    <miso-empty
      v-else
      class="flex-auto pa24 stats--empty"
      heading="No Activity"
      body="There isn't any activity yet.">
      <div class="flex justify-center">
        <span
          class="mb2 br-100 ba b--light-gray bg-off-white stats--empty__icon">
          <feather-icon
            :stroke-width="1.5"
            width="18"
            height="18"
            name="activity"
            color="mid-gray" />
        </span>
      </div>
    </miso-empty>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import ActivityListItem from '#/components/activity/activity-list-item'

import {
  FeatherIcon,
  MisoHeading,
  MisoEmpty,
  MisoMessage
} from 'miso'

export default {
  name: 'ContactsDetailTabsOverviewStatsActivity',

  components: {
    FeatherIcon,
    MisoHeading,
    MisoEmpty,
    MisoMessage,
    ActivityListItem
  },

  computed: {
    ...mapState({
      contact: state => state.contacts.contact,
      account: state => state.accounts.account,
      isLoadingActivities: state => state.activities.isLoadingActivities
    }),

    ...mapGetters('activities', ['recentActivities'])
  },

  methods: {
    ...mapActions(['changeTab']),

    iconName (type) {
      switch (type) {
        case 'Email':
          return 'mail'
        case 'Task':
          return 'check-square'
        case 'Note':
          return 'file-text'
        case 'Field':
          return 'upload-cloud'
        default:
          return ''
      }
    },

    onClickTimeline () {
      this.changeTab('activity')
    }
  }
}
</script>
