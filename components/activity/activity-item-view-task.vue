<template>
  <div class="flex pa3 flex-column">
    <div class="flex flex-auto flex-column">
      <p class="mt0 mb3 f6 fw5">{{ title }}</p>

      <h3 class="main-heading">Description</h3>
      <p class="mt0 mb3 f6">{{ description }}</p>

      <div class="flex flex-auto flex-row">
        <div class="flex-auto">
          <h3 class="main-heading">Due</h3>

          <p class="ma0 f6">{{ dueDate }}</p>
        </div>

        <div class="flex-auto">
          <h3 class="main-heading">Priority</h3>

          <p class="ma0 f6">{{ priority }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-auto flex-column bt b--light-gray activities__sub-info">
      <h3 class="main-heading">Customer</h3>
      <p class="mt0 mb3 f6">{{ account }}</p>

      <h3
        v-if="hasContact"
        class="main-heading">Contact</h3>
      <a
        v-if="hasContact"
        :href="contactUrl"
        class="mt0 mb3 f6 link">
        {{ contact }}
      </a>

      <h3 class="main-heading">Created</h3>
      <p class="mt0 mb3 f6">{{ createdDate }}</p>
    </div>
  </div>
</template>

<script>
import { itemView } from '../mixins/item-view'

export default {
  name: 'ActivityItemViewTask',

  mixins: [itemView],

  computed: {
    title () {
      return `${this.activity.resource.title}`
    },

    dueDate () {
      if (typeof this.activity.resource.due === 'undefined') {
        return 'N/A'
      }
      return this.parseTime(this.activity.resource.due)
    },

    account () {
      return this.activity.resource.account_name
    },

    priority () {
      return this.activity.resource.priority_text
    }
  }
}
</script>
