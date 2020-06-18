<template>
  <div class="flex flex-auto flex-column">
    <tasks-review-complete-call-form
      v-if="!form.taskFormOpened"
      :on-show-side-panel="showTaskForm"
      :is-review="true"
      :is-edit="true"
      :note="taskData"/>

    <tasks-review-complete-call-task-form
      v-else
      :on-hide-side-panel="hideTaskForm"
      :is-edit="false"
      :task="currentNoteTaskData"
      :data="form"/>
  </div>
</template>

<script>
import { mapMutations, mapState, mapGetters } from 'vuex'

import TasksReviewCompleteCallForm from '#/components/notes/notes-form'
import TasksReviewCompleteCallTaskForm from '#/components/tasks/tasks-form'

export default {
  name: 'TasksReviewCompleteCall',

  components: {
    TasksReviewCompleteCallForm,
    TasksReviewCompleteCallTaskForm
  },

  props: {
    'taskData': {
      type: Object,
      default: () => ({
        account: null,
        account_id: null,
        contact: null,
        contact_id: null,
        content_html: null,
        content_plain: null,
        created_at: null,
        created_by_name: null,
        errors: null,
        id: null,
        note_fields: null,
        salesforce_sync_enabled: null,
        tasks: null,
        title: null,
        updated_at: null,
        user_id: null
      })
    }
  },

  computed: {
    ...mapState({
      form: state => state.tasks.forms.call,
      currentSelected: state => state.tasks.currentSelected
    }),
    ...mapGetters(['currentNoteTaskData'])
  },

  methods: {
    ...mapMutations([
      'setFormdata'
    ]),

    hideTaskForm () {
      this.setData('taskFormOpened', false)
    },

    showTaskForm () {
      this.setData('taskFormOpened', true)
    },

    setData (key, value) {
      this.setFormdata(['call', key, value])
    }
  }
}
</script>
