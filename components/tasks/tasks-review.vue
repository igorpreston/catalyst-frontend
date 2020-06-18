<template>
  <div class="vh-100 flex flex-column review">
    <tasks-review-header/>
    <tasks-review-body/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import TasksReviewHeader from '#/components/tasks/tasks-review-header'
import TasksReviewBody from '#/components/tasks/tasks-review-body'

export default {
  name: 'TasksReview',

  components: {
    TasksReviewHeader,
    TasksReviewBody
  },

  computed: {
    ...mapState({
      task: state => state.tasks.task
    })
  },

  watch: {
    '$route' (to, from) {
      this.resetFormdata()
      this.clearNoteTasks()
      if (to.params.taskId && to.params.taskId !== from.params.taskId) {
        console.log('fetch new task', to.params.taskId)
        this.fetchTask(to.params.taskId)
          .then(() => {
            if (this.task.contact) {
              return this.fetchContact(this.task.contact.id)
                .then((res) => {
                  this.updateContact(res.data)
                })
            } else {
              this.resetContact()
              return Promise.resolve()
            }
          })
          .then(() => {
            if (this.task.account) {
              this.fetchAccount(this.task.account.id).then(() => {
                this.fetchContactsByAccount(this.task.account.id)
              })
            }
          })
      }
    }
  },

  created () {
    if (this.$route.params.taskId) {
      this.fetchTask(this.$route.params.taskId)
        .then(() => {
          this.updateReviewIndex(this.$route.params.taskId)
          if (this.task.contact) {
            return this.fetchContact(this.task.contact.id)
              .then((res) => {
                return this.updateContact(res.data)
              })
              .then(() => {
                return this.fetchTasksByDestination(
                  { page: this.page,
                    destination: 'contact',
                    id: this.task.contact.id
                  })
              })
          } else {
            return Promise.resolve()
          }
        })
        .then(() => {
          if (this.task.account) {
            return this.fetchAccount(this.task.account.id)
              .then(() => {
                return this.fetchContactsByAccount(this.task.account.id)
              })
              .then(() => {
                if (!this.task.contact) {
                  return this.fetchTasksByDestination(
                    { page: this.page,
                      destination: 'account',
                      id: this.task.account.id
                    })
                }
              })
          }
        })
    }
  },

  methods: {
    ...mapActions([
      'fetchTask',
      'fetchAccount',
      'fetchContact',
      'fetchContactsByAccount',
      'resetFormdata',
      'updateReviewIndex',
      'resetContact',
      'clearNoteTasks',
      'updateContact',
      'fetchTasksByDestination'
    ])
  }
}
</script>
