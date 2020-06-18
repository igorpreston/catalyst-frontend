<template>
  <div class="flex">
    <activity
      :is-active="isActive"
      destination="account"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Activity from '#/components/activity/activity'
import {
  MisoMessage
} from 'miso'

export default {
  name: 'AccountsDetailTabsActivity',

  components: {
    Activity,
    MisoMessage
  },

  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapState({
      task: state => state.tasks.task,
      account: state => state.accounts.account
    }),

    reviewAccountId () {
      if (this.task) {
        return this.task.account_id
      } else {
        return this.account && this.account.id
      }
    }
  },

  watch: {
    reviewAccountId: function () {
      if (this.reviewAccountId) {
        this.getAccountActivities(this.reviewAccountId)
          .catch(() => MisoMessage.error('Failed to get account activity history'))
      }
    }
  },

  beforeMount () {
    if (this.reviewAccountId) {
      this.getAccountActivities(this.reviewAccountId)
        .catch(() => MisoMessage.error('Failed to get account activity history'))
    }
  },

  methods: {
    ...mapActions('activities', ['getAccountActivities'])
  }
}
</script>
