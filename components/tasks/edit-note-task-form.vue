<template>
  <tasks-form
    :on-hide-side-panel="onHideSidePanel"
    :destination="destination"
    :is-edit="true"
    :task="task">
  </tasks-form>
</template>

<script>
  import Vue from 'vue'

  import { mapState } from 'vuex'

  import TasksForm from '#/components/tasks/tasks-form'

  export default {
    name: 'edit-note-task-form',

    props: [
      'destination',
      'onShowSidePanel'
    ],

    components: {
      TasksForm
    },

    computed: {
      ...mapState({
        task: (state) => state.notes && state.notes.editableTask
      })
    },

    methods: {
      onHideSidePanel() {
        this.onShowSidePanel('EditNoteForm')
      }
    }
  }
</script>
