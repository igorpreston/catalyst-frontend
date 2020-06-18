<template>
  <footer class="bt b--purple-gray tr pv3 form__footer ph3 w-100 absolute bottom-0">
    <miso-button
      v-if="!task.is_completed"
      type="primary"
      @click="complete">Finish Todo</miso-button>
    <miso-button
      v-else
      type="primary"
      @click="undo">Undo</miso-button>
  </footer>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import {
  MisoButton,
  MisoMessage
} from 'miso'

export default {
  name: 'TasksReviewCompleteTodo',

  components: {
    MisoButton
  },

  computed: {
    ...mapState({
      task: state => state.tasks.task
    })
  },

  methods: {
    ...mapActions(['completeTodoTask', 'undoCompleteTask']),
    complete () {
      this.completeTodoTask()
        .then(() => MisoMessage.success('Successfully completed the task'))
        .catch(() => MisoMessage.error('Failed to complete the task'))
    },
    undo () {
      this.undoCompleteTask()
        .then(() => MisoMessage.success('Successfully undone the task'))
        .catch(() => MisoMessage.error('Failed to undo the task'))
    }
  }
}
</script>
