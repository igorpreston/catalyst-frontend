<template>
  <tasks-form
    :on-hide-side-panel="onHideSidePanel"
    :destination="destination"
    :is-edit="false"
    :task="currentNoteTaskData">
  </tasks-form>
</template>

<script>
  import { mapGetters } from 'vuex'

  import TasksForm from '#/components/tasks/tasks-form'

  export default {
    name: 'create-note-task-form',

    props: [
      'onHideSidePanel',
      'destination'
    ],

    components: {
      TasksForm
    },

    computed: {
      ...mapGetters(['currentNoteTaskData'])
    }
  }
</script>
