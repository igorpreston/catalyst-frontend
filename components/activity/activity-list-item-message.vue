<template>
  <div
    :class="isSelected"
    @click="viewDetails">
    <div class="mid-gray z-1 activity__time">{{ toTimeInTimeZone(activity.when) }}</div>

    <div class="bg-white z-1 activity__circle">
      <feather-icon
        name="mail"
        width="15"
        height="15"
        color="mid-gray-accent"/>
    </div>

    <div
      class="activity__text">
      <p
        class="mt0 activity__title">
        {{ action | capitalize }} {{ listTitle }}
      </p>

      <p
        class="ma0 mb1 flex items-center activity__description">
        {{ title }}
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
  name: 'ActivityListItemEmail',

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
      return this.activity.resource.subject
    },

    listTitle () {
      const targetStr = this.activity.verb === 'sent'
        ? 'to ' + this.activity.resource.recipient.full_name
        : 'from ' + this.activity.resource.sender.full_name
      return `an email ${targetStr}`
    },

    isSelected () {
      if (this.currentlySelectedItem === null) {
        return false
      } else if (this.activity.id === this.currentlySelectedItem.id) {
        return 'selected'
      }
      return false
    }
  },

  methods: {
    viewDetails () {
      this.onOpenedItem('message')
      this.onSelectListItem(this.activity)
    }
  }
}
</script>
