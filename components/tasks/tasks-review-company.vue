<template>
  <div
    v-if="task"
    class="bg-off-purple flex flex-auto">
    <contacts-detail
      v-if="task.contact && task.contact.id"
      :is-header-visible="false"
      :review-mode="true"/>
    <accounts-detail
      v-else
      :is-header-visible="false"
      :review-mode="true"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import AccountsDetail from '#/components/accounts/accounts-detail'
import ContactsDetail from '#/components/contacts/contacts-detail'

export default {
  name: 'TasksReviewCompany',

  components: {
    AccountsDetail,
    ContactsDetail
  },

  computed: {
    ...mapState({
      task: state => state.tasks.task
    })
  }
}
</script>
