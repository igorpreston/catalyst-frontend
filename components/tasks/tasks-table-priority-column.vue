<template>
  <p class="mv0 truncate" v-bind:class="getColorWithStatus(isCompleted)['text_color']"><span v-if="priority" class="oval mr2"></span>{{ priority_text }}</p>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    name: 'tasks-table-priority-column',

    props: [
      'priority_text',
      'priority',
      'isCompleted'
    ],

    computed: {
      ...mapGetters([
        'getColorWithStatus'
      ])
    }
  }
</script>

<style lang="scss">
  .oval {
    width: 5px;
    height: 5px;
    background-color: red;
    display: inline-block;
    line-height: 24px;
    vertical-align: 2px;
    border-radius: 5px;
  }
</style>
