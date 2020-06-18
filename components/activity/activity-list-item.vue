<template>
  <div
    :class="itemClass"
    class="flex flex-column relative activity__list mb4">
    <div
      v-if="!isOverview"
      ref="activityListItemHeading"
      class="flex flex-auto relative list__heading">
      <p class="ma0 fw5 activity__date">{{ date }}</p>

      <el-button
        type="text"
        name="toggle-activities"
        class="ml2 activity__toggle"
        @click="toggleActivities">
        <feather-icon
          :name="iconName"
          width="15"
          height="15"
          color="purple"/>
      </el-button>
    </div>

    <div
      v-if="isOpenedActivities"
      class="flex flex-auto flex-column activity__sublist">
      <component
        v-for="activity in activities"
        :key="activity.id"
        :id="activity.id"
        :is="'ActivityListItem' + activity.type"
        :activity="activity"
        :currently-selected-item="currentlySelectedItem"
        :on-select-list-item="onSelectListItem"
        :on-opened-item="onOpenedItem"
        :is-overview="isOverview"
        class="flex flex-auto relative pv2 pr3 items-center hover-bg-off-purple activity__item"/>
    </div>
  </div>
</template>

<script>
import { Button } from 'element-ui'
import { FeatherIcon } from 'miso'

import ActivityListItemTicket from '#/components/activity/activity-list-item-ticket'
import ActivityListItemMessage from '#/components/activity/activity-list-item-message'
import ActivityListItemTask from '#/components/activity/activity-list-item-task'
import ActivityListItemCampaign from '#/components/activity/activity-list-item-campaign'
import ActivityListItemNote from '#/components/activity/activity-list-item-note'
import ActivityListItemField from '#/components/activity/activity-list-item-field'

export default {
  name: 'ActivityListItem',

  components: {
    'el-button': Button,
    FeatherIcon,

    ActivityListItemTicket,
    ActivityListItemMessage,
    ActivityListItemTask,
    ActivityListItemCampaign,
    ActivityListItemNote,
    ActivityListItemField
  },

  props: {
    date: {
      type: String,
      default: null
    },
    activities: {
      type: Array,
      default: () => []
    },
    isOpened: {
      type: Boolean,
      default: false
    },
    onOpenedItem: {
      type: Function,
      default () {}
    },
    currentlySelectedItem: {
      type: Object,
      default: () => ({})
    },
    onSelectListItem: {
      type: Function,
      default () {}
    },
    isOverview: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isOpenedActivities: this.isOpened
    }
  },

  computed: {
    iconName () {
      if (this.isOpenedActivities) {
        return 'minus-square'
      } else {
        return 'plus-square'
      }
    },

    itemClass () {
      if (this.isOpenedActivities) {
        return 'opened'
      } else {
        return 'bb b--light-gray'
      }
    }
  },

  methods: {
    toggleActivities () {
      this.isOpenedActivities = !this.isOpenedActivities
    }
  }
}
</script>

<style lang="scss">
  .activity {
    &__list {
      flex: 0 0 auto;

      &.opened + .opened .activity__sublist::before {
        content: '';
        position: absolute;
        top: -9px;
        left: 112px;
        width: 1px;
        height: 80px;
        background-color: #EAE8FA;
        z-index: 4;
      }

      &:last-child .activity__item--last {
        display: flex;
        margin-top: 26px;
        margin-left: 108px;

        ::after {
          content: '';
          position: absolute;
          top: -17px;
          left: 4px;
          width: 1px;
          height: 20.5px;
          background-color: #EAE8FA;
          z-index: 1;
        }
      }
    }

    &__item {
      min-height: 51px;

      &.selected,
      &:hover {
        background-color: #fbfbfe;
        box-shadow: inset 0px 0px 0px 1px #EAE8FA;
      }

      &:not(.selected):hover {
        cursor: pointer;

        .activity__arrow {
          visibility: visible;
        }
      }

      &::before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 111.5px;
        z-index: -1;
        background-color: #fff;
        box-shadow: 0 -1px 0 0 #fff, 0 1px 0 0 #fff;
      }

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        bottom: -25px;
        left: 112px;
        width: 1px;
        height: 53px;
        background-color: #EAE8FA;
        z-index: 1;
      }

      &.selected {
        .activity__title {
          color: lighten(#404046, 40%);
        }

        .activity__description {
          &,
          & span {
            color: lighten(#9C9CA6, 20%);
          }
        }
      }

      &--last {
        display: none;
      }
    }

    &__arrow {
      visibility: hidden;
    }

    &__date {
      flex: 0 0 80px;
      font-size: 14px;
    }

    &__toggle {
      padding: 0 !important;
    }

    &__time {
      flex: 0 0 80px;
      margin-right: 15.5px;
      font-size: 14px;
    }

    &__circle {
      margin-right: 15.5px;
      padding: 7.5px;
      border: 1px solid #EAE8FA;
      border-radius: 100%;
      z-index: 3;
    }

    &__title {
      margin-bottom: 6px;
      font-size: 14px;
      color: #404046;
    }

    &__description {
      font-size: 12px;
      color: #9C9CA6;
    }
  }

  .fixed-heading {
    position: fixed;
    top: 188px;
  }
</style>

<style scoped lang="scss">
  .list__heading {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    margin: 1px 0;
    padding: 24px 0 18px;
    background-color: #fff;
    z-index: 4;
  }

  .circle {
    width: 9px;
    height: 9px;
    margin-right: 27px;
    border-radius: 100%;
    background-color: #EAE8FA;
  }

  .beginning {
    font-size: 14px;
  }
</style>
