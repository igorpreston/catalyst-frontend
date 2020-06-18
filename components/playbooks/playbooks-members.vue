<template>
  <div class="flex flex-column f6 members">
    <p class="ma0 lh-copy">
      This Playbook will run on
      <span class="fw8">{{ membersCount || 0 }}</span>
      {{ membersType }}
      <i>today</i>
      <!-- that match the following conditions: -->
    </p>

    <p class="flex flex-auto mt2 mb0 pb24">
      <feather-icon
        width="14"
        height="14"
        name="info"
        color="mid-gray"
        class="mr1">
      </feather-icon>
      {{ membersTypeConverted }}
      may change as conditions are met.
    </p>

    <div
      slot="empty"
      v-if="!ifMembers">
      <p class="ma0 members__absent">Add triggers and filters to see a preview!</p>
    </div>

    <div
      v-else
      v-for="member in members"
      class="flex items-center mb3">
      <circle-badge
        variant="dark"
        class="mr2"
        v-if="membersType === 'contacts'">
        {{ member.name_initials }}
      </circle-badge>

      <div class="flex flex-auto flex-column">
        <div class="mb1">
          <a
            :href="linkToMember(member.id, membersType)"
            class="link mr2">
            {{ member.full_name || member.name }}
          </a>

          <span v-if="membersType === 'contacts'">
            {{ member.title }} @ {{ member.account.name }}
          </span>
        </div>

        <p class="ma0 mid-gray">
          {{ member.email }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

import {
  CircleBadge,
  FeatherIcon
} from 'miso'

export default {
  name: 'playbooks-members',
  props: ['members', 'membersType', 'view'],
  components: {
    CircleBadge,
    FeatherIcon
  },

  computed: {
    ...mapState({
      count: state => state.playbooks.memberCount
    }),

    ifMembers () {
      return this.members.length || false
    },

    membersCount () {
      return this.members.length && this.count
    },

    membersTypeConverted () {
      return _.capitalize(this.membersType)
    }
  },

  methods: {
    linkToMember (id, membersType) {
      return `/${membersType}/${id}`
    }
  }
}
</script>

<style scoped lang="scss">
  .members {
    flex: 0 0 auto;

    &__absent {
      color: #D4D4D8;
    }
  }
</style>
