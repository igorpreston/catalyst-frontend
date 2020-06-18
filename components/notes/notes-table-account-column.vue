<template>
  <div>
    <p class="mv0 db truncate">{{ contactName }}</p>
    <p class="mv0 db truncate two-lines mid-gray">
      {{ contactTitle }}
    </p>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'notes-table-account-column',

    props: [
      'accountId',
      'accountName',
      'contactId',
      'contactTitle',
      'contactName'
    ],

    computed: {
      accountUrl () {
        return `/accounts/${this.accountId}`
      },

      contactUrl () {
        return `/contacts/${this.contactId}`
      }
    }
  }
</script>
