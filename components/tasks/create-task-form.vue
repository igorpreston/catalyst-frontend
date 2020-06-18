<template>
  <tasks-form
    :on-hide-side-panel="onHideSidePanel"
    :destination="destination">
  </tasks-form>
</template>

<script>
  import { mapActions } from 'vuex'

  import TasksForm from '#/components/tasks/tasks-form'

  export default {
    name: 'create-task-form',

    props: [
      'onHideSidePanel',
      'destination'
    ],

    components: {
      TasksForm
    },

    methods: {
      ...mapActions([
        'fetchUsers',
      ])
    },

    beforeMount () {
      this.fetchUsers()
    }
  }
</script>
