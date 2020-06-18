<template>
  <div class="flex pa3 flex-column">
    <div class="flex flex-auto flex-column">
      <h3 class="main-heading">Subject</h3>
      <p class="mt0 mb3 f6">{{ title }}</p>

      <h3 class="main-heading">Description</h3>
      <p class="mt0 mb3 f6">{{ description }}</p>

      <div class="flex flex-auto flex-row">
        <div class="flex-auto">
          <h3 class="main-heading">Status</h3>

          <p class="ma0 f6">{{ status }}</p>
        </div>

        <div class="flex-auto">
          <h3 class="main-heading">Priority</h3>

          <p class="ma0 f6">{{ priority }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-auto flex-column bt b--light-gray activities__sub-info">
      <h3 class="main-heading">Ticket Owner</h3>
      <p class="mt0 mb3 f6">Derik Olsson</p>

      <h3 class="main-heading">Ticket Submitter</h3>
      <a
        :href="contactUrl"
        class="mt0 mb3 f6 link">
        {{ contact }}
      </a>

      <h3 class="main-heading">Created</h3>
      <p class="mt0 mb3 f6">{{ createdDate }}</p>

      <h3 class="main-heading">Updated</h3>
      <p class="mt0 mb3 f6">{{ updatedDate }}</p>
    </div>
  </div>
</template>

<script>
import { itemView } from '../mixins/item-view'

export default {
  name: 'ActivityItemViewTicket',

  mixins: [itemView],

  computed: {
    title () {
      return `${this.activity.resource.subject}`
    },

    status () {
      return this.activity.resource.status
    },

    priority () {
      return this.activity.resource.priority
    }
  }
}
</script>
