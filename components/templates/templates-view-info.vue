<template>
  <div class="flex flex-column info">
    <div class="flex flex-auto flex-column">
      <h2 class="ttu mid-gray mt2 mb0 templates-view__heading">Template Name</h2>

      <p class="ma0">{{ name }}</p>
    </div>

    <div class="flex flex-auto flex-column mt3">
      <h2 class="ttu mid-gray mt2 mb0 templates-view__heading">Created</h2>

      <p class="ma0">{{ formattedDate }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .info {
    padding-bottom: 24px;
    font-size: 14px;
    line-height: 22px;
  }
</style>

<script>
import moment from 'moment-timezone'
import { FeatherIcon } from 'miso'
import { mapState } from 'vuex'

export default {
  name: 'TemplatesViewInfo',

  components: {
    FeatherIcon
  },

  props: {
    name: {
      type: String,
      default: null
    },
    date: {
      type: String,
      default: null
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    }),
    formattedDate () {
      const date = moment.tz(this.date,
        (this.currentUser && this.currentUser.time_zone) || 'UTC')

      const dateFormatted = date.format('MM/DD/YYYY')
      const timeFormatted = date.format('hh:mm a')

      return `${dateFormatted} at ${timeFormatted}`
    }
  }
}
</script>
