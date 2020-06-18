<template>
  <div class="bl b--light-gray tasks-review-complete f6 overflow-auto w-100 relative">
    <header
      v-if="task && task.is_completed"
      class="pv3 mh3 bb b--light-gray">
      <p
        class="flex items-center">
        <feather-icon
          class="mr2"
          height="16"
          width="16"
          name="check-circle"
          color="green"/>
        This task has been completed!
      </p>
    </header>
    <header class="pv3 mh3 bb b--light-gray">
      <miso-label class="db mb2 mid-gray">Task Description</miso-label>
      <p class="mv0 f6 dark-gray-accent lh-copy">{{ task && task.description }}</p>
    </header>
    <component
      :is="taskAction"
      :task-data="taskData"/>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

import TasksReviewCompleteCall from '#/components/tasks/tasks-review-complete-call'
import TasksReviewCompleteEmail from '#/components/tasks/tasks-review-complete-email'
import TasksReviewCompleteTodo from '#/components/tasks/tasks-review-complete-todo'

import {
  FeatherIcon,
  MisoLabel
} from 'miso'

export default {
  name: 'TasksReviewComplete',

  components: {
    FeatherIcon,
    MisoLabel,

    TasksReviewCompleteCall,
    TasksReviewCompleteEmail,
    TasksReviewCompleteTodo
  },

  computed: {
    ...mapGetters(['currentNoteData']),
    ...mapState({
      notes: state => state.notes.all,
      task: state => state.tasks.task
    }),

    taskAction () {
      if (!this.task) {
        return
      }

      switch (this.task.category) {
        case 'call':
          return 'TasksReviewCompleteCall'
        case 'email':
          return 'TasksReviewCompleteEmail'
        case 'to_do':
          return 'TasksReviewCompleteTodo'
        default:
          return null
      }
    },

    taskData () {
      if (!this.task) {
        return
      }
      switch (this.task.category) {
        case 'call':
          return this.currentNote
        case 'email':
          return this.task.email
        case 'to_do':
          return null
        default:
          return null
      }
    },

    currentNote () {
      return this.task &&
        this.notes.find(note => this.task.child_note_id === note.id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .tasks-review-complete {
    flex: 0 0 340px;
    background: #fff;
    width: 341px;

    &__description {
      color: #3D3D44;
    }
  }
</style>
