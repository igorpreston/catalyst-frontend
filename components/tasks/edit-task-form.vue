<template>
  <tasks-form
    :is-edit="true"
    :task="firstSelectedTask"
    :on-hide-side-panel="onHideSidePanel"
    :destination="destination"/>
</template>

<script>
import { mapGetters } from 'vuex'

import TasksForm from '#/components/tasks/tasks-form'

export default {
  name: 'EditTaskForm',

  components: {
    TasksForm
  },

  props: {
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    destination: {
      type: String,
      default: null
    }
  },

  computed: {
    ...mapGetters(['firstSelectedTask'])
  }
}
</script>
