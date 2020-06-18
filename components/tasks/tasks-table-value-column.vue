<template>
  <p class="mv0 truncate" v-bind:class="getColorWithStatus(isCompleted)['text_color']">{{ value | currency }}</p>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'tasks-table-value-column',

    props: [
      'value',
      'isCompleted'
    ],

    computed: {
      ...mapGetters([
        'getColorWithStatus'
      ])
    }
  }
</script>
