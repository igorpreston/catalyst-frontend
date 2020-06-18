<template>
  <feather-icon
    v-if="isCompleted"
    width="16"
    height="16"
    name="check-circle"
    color="green">
  </feather-icon>
</template>

<script>
  import {
    FeatherIcon
  } from 'miso'

  import { mapGetters } from 'vuex'

  export default {
    name: 'tasks-table-status-column',

    components: {
      FeatherIcon
    },

    props: [
      'isCompleted'
    ],

    computed: {
      ...mapGetters([
        'getColorWithStatus'
      ])
    }
  }
</script>
