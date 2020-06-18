<template>
  <div v-if="contactId">
    <p class="ma0 dark-gray">{{ contactName }}</p>

    <p class="mv0 db mid-gray truncate two-lines">{{ contactTitle }} @ {{ accountName }}</p>
  </div>

  <div v-else>
    <p class="ma0 dark-gray truncate two-lines">{{ accountName }}</p>
  </div>
</template>

<script>
import {
  MisoTableColumn
} from 'miso'

import { mapGetters } from 'vuex'

export default {
  name: 'TasksTableCustomerColumn',

  components: {
    MisoTableColumn
  },

  props: {
    accountName: {
      type: String,
      default: null
    },
    contactId: {
      type: String,
      default: null
    },
    contactTitle: {
      type: String,
      default: null
    },
    contactName: {
      type: String,
      default: null
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters([
      'getColorWithStatus'
    ])
  }
}
</script>
