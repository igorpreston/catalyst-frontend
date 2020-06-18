<template>
  <div class="flex flex-auto br bb b--light-gray el-col-0 overflow-auto">
    <miso-empty
      v-if="!activityType"
      variant="gray"
      class="activities__empty">
      <feather-icon
        name="sidebar"
        width="33"
        height="33"
        color="mid-gray"
        class="db center"/>

      <p class="ma0 f6">Select an item to read</p>
    </miso-empty>

    <div
      v-else
      class="w-100">
      <div
        class="flex items-center justify-end mh3 pv3 bb b--light-gray content-flex-end">

        <div class="pl2">
          <miso-button
            type="transparent"
            size="tiny"
            class="pa1"
            @click="close">
            <feather-icon
              name="x"
              height="20"
              width="20"
              color="gray"/>
          </miso-button>
        </div>
      </div>

      <component
        :activity="currentlySelectedItem"
        :is="viewedItem"
        class="mh3 activities__view"/>
    </div>
  </div>
</template>

<script>
import {
  MisoEmpty,
  FeatherIcon,
  MisoButton
} from 'miso'

import ActivityItemViewTicket from '#/components/activity/activity-item-view-ticket'
import ActivityItemViewNote from '#/components/activity/activity-item-view-note'
import ActivityItemViewTask from '#/components/activity/activity-item-view-task'
import ActivityItemViewMessage from '#/components/activity/activity-item-view-message'
import ActivityItemViewCampaign from '#/components/activity/activity-item-view-campaign'

export default {
  name: 'ActivityItemView',

  components: {
    MisoEmpty,
    FeatherIcon,
    MisoButton,

    ActivityItemViewTicket,
    ActivityItemViewNote,
    ActivityItemViewTask,
    ActivityItemViewMessage,
    ActivityItemViewCampaign
  },

  props: {
    activityType: {
      type: String,
      default: null
    },
    onCloseItem: {
      type: Function,
      default () {}
    },
    isFilterVisible: {
      type: Boolean,
      default: false},
    currentlySelectedItem: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    viewedItem () {
      switch (this.activityType) {
        case 'ticket':
          return 'ActivityItemViewTicket'
        case 'note':
          return 'ActivityItemViewNote'
        case 'task':
          return 'ActivityItemViewTask'
        case 'message':
          return 'ActivityItemViewMessage'
        case 'campaign':
          return 'ActivityItemViewCampaign'
        default:
          return ''
      }
    }
  },

  methods: {
    close () {
      this.onCloseItem()
    }
  }
}
</script>

<style lang="scss">
  .activities {
    &__empty {
      border: 0;

      .db {
        display: block !important;
      }
    }

    &__view {
      flex: 0 0 auto;
      line-height: 22px;
    }

    &__sub-info {
      width: calc(100% - 95px);
      margin-top: 24px;
      padding-top: 24px;
    }
  }
</style>
