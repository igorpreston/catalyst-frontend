<template>
  <div
    :class="isSelected"
    @click="onItemClick">
    <div class="mid-gray z-1 activity__time">{{ toTimeInTimeZone(activity.when) }}</div>

    <div class="bg-white z-1 activity__circle">
      <feather-icon
        name="message-square"
        width="15"
        height="15"
        color="mid-gray-accent"/>
    </div>

    <div
      class="activity__text">
      <p
        class="mt0 activity__title">
        {{ title }}
      </p>

      <p
        class="ma0 mb1 flex items-center activity__description">
        {{ action | capitalize }}
      </p>

      <p
        class="ma0 activity__description">
        {{ description }}
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
import { itemView } from '../mixins/item-view'

export default {
  name: 'ActivityListItemCampaign',

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
    title () {
      switch (this.activity.resource_type) {
        case 'Segment':
          return `${this.activity.actor} ${this.activity.verb} called ${this.activity.changes}`
        case 'Email':
          return `${this.activity.actor} ${this.activity.verb} ${this.activity.changes}`
        default:
          return ''
      }
    },

    description () {
      return ''
    },

    isSelected () {
      if (this.currentlySelectedItem === null) {
        return ''
      } else if (this.activity.id === this.currentlySelectedItem.id) {
        return 'selected'
      }

      return ''
    }
  },

  methods: {
    onItemClick () {
      this.onOpenedItem('campaign')
      this.onSelectListItem(this.activity)
    }
  }
}
</script>
