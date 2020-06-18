<template>
  <div>
    <div class="mid-gray z-1 activity__time">{{ toTimeInTimeZone(activity.when) }}</div>

    <div class="bg-white z-1 activity__circle">
      <feather-icon
        name="upload-cloud"
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
    </div>
  </div>
</template>

<script>
import { FeatherIcon } from 'miso'
import { itemView } from '../mixins/item-view'

export default {
  name: 'ActivityListItemField',

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
    listTitle () {
      return this.activity.changes
    }
  }
}
</script>
