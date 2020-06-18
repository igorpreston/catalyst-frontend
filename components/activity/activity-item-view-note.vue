<template>
  <div class="flex pa3 flex-column">
    <div class="flex flex-auto flex-column">
      <h2 class="main-heading">Title</h2>
      <p class="mt0 mb3 f6">{{ title }}</p>

      <h2 class="main-heading">Description</h2>
      <div class="mb3 description">
        <p
          class="ma0 f6"
          v-html="description"/>
      </div>

      <div class="flex">
        <div class="flex flex-auto flex-column">
          <h2 class="main-heading"># of fields</h2>
          <p class="ma0 f6">{{ numOfFields }}</p>
        </div>

        <div class="flex flex-auto flex-column">
          <h2 class="main-heading"># of tasks</h2>
          <p class="ma0 f6">{{ numOfTasks }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-column bt b--light-gray activities__sub-info">
      <h2 class="main-heading">Author</h2>
      <p class="mt0 mb3 f6">{{ author }}</p>

      <h2 class="main-heading">Customer</h2>
      <a
        :href="contactUrl"
        class="mt0 mb3 f6 link">{{ contact }}</a>

      <h2 class="main-heading">Created</h2>
      <p class="mt0 mb3 f6">{{ createdDate }}</p>

      <h2 class="main-heading">Updated</h2>
      <p class="mt0 mb3 f6">{{ updatedDate }}</p>
    </div>
  </div>
</template>

<script>
import { FeatherIcon } from 'miso'
import { itemView } from '../mixins/item-view'

export default {
  name: 'ActivityItemViewNote',

  components: {
    FeatherIcon
  },

  mixins: [itemView],

  computed: {
    title () {
      return `${this.activity.resource.title}`
    },

    numOfFields () {
      return this.activity.resource.note_fields.length
    },

    numOfTasks () {
      return this.activity.resource.tasks.length
    },

    author () {
      return this.activity.resource.created_by_name
    }
  }
}
</script>
