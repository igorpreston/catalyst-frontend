<template>
  <div
    :class="isSelected"
    @click="viewDetails">
    <div class="mid-gray z-1 activity__time">{{ toTimeInTimeZone(activity.when) }}</div>

    <div class="bg-white z-1 activity__circle">
      <feather-icon
        name="file-text"
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
  name: 'ActivityListItemNote',

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
      return `${this.activity.resource.title}`
    },

    listTitle () {
      let str = this.activity.changes === '' ? '' : `${this.activity.changes} for`

      str = `${str} ${this.activity.verb === 'created' ? 'a' : 'the'} note for `

      if (this.hasContact) {
        str = `${str} ${this.activity.owner.full_name} @`
      }

      return `${str} ${this.activity.resource.account.name}`
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
      this.onOpenedItem('note')
      this.onSelectListItem(this.activity)
    }
  }
}
</script>
