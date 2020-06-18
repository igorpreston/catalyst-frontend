<template>
  <div class="flex">
    <activity
      :is-active="isActive"
      destination="contacts"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Activity from '#/components/activity/activity'
import {
  MisoMessage
} from 'miso'

export default {
  name: 'ContactsDetailTabsActivity',

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
      contact: state => state.contacts.contact
    }),

    reviewContactId () {
      if (this.task) {
        return this.task.contact && this.task.contact.id
      } else {
        return this.contact && this.contact.id
      }
    }
  },

  watch: {
    reviewContactId (newVal, oldVal) {
      if (newVal) {
        this.fetchActivity()
      }
    }
  },

  beforeMount () {
    this.fetchActivity()
  },

  methods: {
    ...mapActions('activities', ['getContactActivities']),
    fetchActivity () {
      if (this.reviewContactId) {
        this.getContactActivities(this.reviewContactId)
          .catch(() => MisoMessage.error('Failed to get contact activity history'))
      }
    }
  }
}
</script>
