<template>
  <div
    :class="itemClass"
    class="flex flex-column relative activity__list">
    <div
      ref="activityListItemHeading"
      class="flex flex-auto relative list__heading">
      <p class="ma0 fw5 activity__date">{{ dateConverted }}</p>

      <el-button
        class="ml2 activity__toggle"
        type="text"
        name="toggle-activities"
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
      <div
        v-for="(item, index) in values"
        :key="index"
        class="flex flex-auto relative items-center f6 mb3 activity__item">
        <div class="flex mid-gray mr2 activity__item--time">
          {{ timeConverted(item.time) }}
        </div>

        <div class="circle"/>

        <div class="activity__item--description truncate three-lines">
          <a
            :href="memberUrl(item.member_id, item.member_type)"
            class="link">
            {{ item.member_name }}
          </a>

          <span>
            {{ item.action }}
            {{ segmentName }}
            based on
          </span>

          <span
            v-for="term in item.terms"
            :key="term.field"
            class="dib ma0 v-top">
            {{ term.field }}
            {{ term.operator }}
            {{ term.value }}
          </span>
        </div>
      </div>

      <div
        v-if="lastItem"
        class="flex flex-auto items-center relative activity__item--last">
        <div class="circle"/>

        <p class="ma0 f6">The Beginning 🌞</p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import { mapState } from 'vuex'

import {
  Button,
  Tooltip
} from 'element-ui'

import {
  FeatherIcon
} from 'miso'

export default {
  name: 'SegmentsActivityListItem',

  components: {
    'el-button': Button,
    'el-tooltip': Tooltip,
    FeatherIcon
  },

  props: {
    date: {
      type: String,
      default: null
    },
    values: {
      type: Array,
      default: () => []
    },
    lastItem: {
      type: Boolean,
      default: false
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
      type: Number,
      default: 0
    },
    onSelectListItem: {
      type: Function,
      default () {}
    },
    segmentName: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      isOpenedActivities: this.isOpened
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.currentUser
    }),

    dateConverted () {
      return moment.tz(this.date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    },

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
    },

    timeConverted (time) {
      return moment.tz(time * 1000, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('h:mm a')
    },

    memberUrl (id, memberType) {
      switch (memberType) {
        case 'Account':
          return `/accounts/${id}`
        case 'Contact':
          return `/contacts/${id}`
        default:
          return ''
      }
    }
  }
}
</script>

<style lang="scss">
  .activity {
    &__list {
      flex: 0 0 auto;

      &:last-child .activity__item--last {
        display: flex;
        margin-top: 19px;
        margin-left: 79px;

        .circle {
          margin-left: 0;
        }

        ::after {
          content: '';
          position: absolute;
          top: -17px;
          left: 3px;
          width: 1px;
          height: 30px;
          background-color: #EAE8FA;
          z-index: 1;
        }
      }
    }

    &__item {
      min-height: 40px;
      line-height: 20px;

      &:not(:last-child)::after {
        content: '';
        position: absolute;
        bottom: -35px;
        left: 82px;
        width: 1px;
        height: 57px;
        background-color: #EAE8FA;
        z-index: 1;
      }

      &--last {
        display: none;
      }

      &--time {
        width: 70px;
      }

      &--description {
        width: 190px;
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
    margin: 1px 0;
    padding: 24px 0 18px;
    background-color: #fff;
    z-index: 4;
  }

  .circle {
    flex: 0 0 7px;
    width: 7px;
    height: 7px;
    margin-left: 1px;
    margin-right: 10px;
    border-radius: 100%;
    background-color: #EAE8FA;
  }

  .terms {
    width: 86px;
  }
</style>
