<template>
  <div class="info">
    <h2 class="ttu mid-gray note-view__heading">Title</h2>
    <p class="mt0 mb3">{{ note.title }}</p>
    <div class="flex flex-auto flex-column mb3">
      <h2 class="ttu mid-gray mt2 mb0 note-view__heading">Created</h2>
      <p class="ma0">{{ createdAt }}</p>
    </div>
    <div class="flex flex-auto flex-column mb3">
      <h2 class="ttu mid-gray mt2 mb0 note-view__heading">Updated</h2>
      <p class="ma0">{{ updatedAt }}</p>
    </div>

    <div class="flex mid-gray f7 info__hint">
      <!-- Commented this part until all will be clarified -->
      <!--<feather-icon-->
      <!--name="info"-->
      <!--height="15"-->
      <!--width="15"-->
      <!--color="mid-gray"-->
      <!--class="mr1"></feather-icon>-->
      <!--<span>This note is part of task</span>-->
      <!--<a href="#" class="link ml1">Call John Snow at Winterfell inc.</a>-->
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .info {
    font-size: 14px;
    line-height: 22px;
    &__hint {
      margin: 24px 0;
    }
  }
</style>

<script>
import { FeatherIcon } from 'miso'
import moment from 'moment-timezone'
import { mapState } from 'vuex'

export default {
  name: 'NotesViewInfo',

  components: {
    FeatherIcon
  },

  props: {
    note: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    }),

    createdAt () {
      return this.convertDate(this.note.created_at)
    },

    updatedAt () {
      return this.convertDate(this.note.updated_at)
    }
  },

  methods: {
    convertDate (date) {
      const time = moment.tz(date, (this.currentUser && this.currentUser.time_zone) || 'UTC')
      return time.format('MM/DD/YYYY') + ' at ' + time.format('hh:mm a')
    }
  }

}
</script>
