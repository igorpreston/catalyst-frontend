<template>
  <div class="flex pa3 flex-column">
    <div class="flex flex-auto flex-column">
      <h3 class="main-heading">Subject</h3>
      <p class="mt0 mb3 f6">{{ subject }}</p>

      <h3 class="main-heading">Description</h3>
      <p class="mt0 mb3 f6"/><div v-html="description"/>

      <div class="flex flex-auto flex-row">
        <div class="flex-auto">
          <h3 class="main-heading">Campaign</h3>

          <p class="ma0 f6">{{ campaign }}</p>
        </div>

        <div class="flex-auto">
          <h3 class="main-heading">Step</h3>

          <p class="ma0 f6">{{ step }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-auto flex-column bt b--light-gray activities__sub-info">
      <h3 class="main-heading">Customer</h3>
      <p class="mt0 mb1 f6">{{ customerName }}</p>
      <p class="mt0 mb3 f6">{{ customerDetail }}</p>

      <h3 class="main-heading">Created</h3>
      <p class="mt0 mb3 f6">{{ createdDate }}</p>
    </div>
  </div>
</template>

<script>
import { FeatherIcon } from 'miso'
import { itemView } from '../mixins/item-view'

export default {
  name: 'ActivityItemViewCampaign',

  components: {
    FeatherIcon
  },

  mixins: [itemView],

  computed: {
    campaign () {
      if (this.activity.resource_type === 'Email') {
        return this.activity.resource.originator.campaign_name
      }
      return '$5K Onboarding'
    },

    step () {
      if (this.activity.resource_type === 'Email') {
        return this.activity.resource.originator.step
      }
      return '1'
    },

    customerName () {
      return this.activity.owner.full_name
    },

    customerDetail () {
      return `${this.activity.owner.title} @ ${this.activity.owner.account.name}`
    }
  }
}
</script>
