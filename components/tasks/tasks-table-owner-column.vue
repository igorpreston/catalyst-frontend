<template>
  <p class="mv0 truncate" v-bind:class="getColorWithStatus(isCompleted)['text_color']">{{ owner_name }}</p>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'tasks-table-owner-column',

    props: [
      'owner_name',
      'isCompleted'
    ],

    computed: {
      ...mapGetters([
        'getColorWithStatus'
      ])
    }
  }
</script>
