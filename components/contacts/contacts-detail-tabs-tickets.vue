<template>
  <keep-alive>
    <component
      :is="activeComponent"
      @switch="switchComponent">
      <!-- inactive components will be cached! -->
    </component>
  </keep-alive>
</template>

<script>
import Vue from 'vue'
import TicketTable from '#/components/accounts/TicketTable'
import Ticket from '#/components/accounts/Ticket'
import { mapState, mapActions } from 'vuex'
import Vue2Filters from 'vue2-filters'
Vue.use(Vue2Filters)

export default {
  name: 'ContactsDetailTabsTickets',

  components: {
    'ticketTable': TicketTable,
    'ticket': Ticket
  },

  data () {
    return {
      activeComponent: 'ticketTable',
      isTable: true
    }
  },

  computed: {
    ...mapState({
      account: state => state.contacts.contact
    })
  },

  watch: {
    contact: function () {
      if (this.contact) {
        this.fetchTicketsByContact(this.contact.id)
      }
    }
  },

  methods: {
    ...mapActions('tickets', ['getTickets', 'fetchTicketsByContact']),
    switchComponent () {
      if (this.isTable) {
        this.activeComponent = 'ticket'
      } else {
        this.activeComponent = 'ticketTable'
      }
      this.isTable = !this.isTable
    }
  }
}
</script>
