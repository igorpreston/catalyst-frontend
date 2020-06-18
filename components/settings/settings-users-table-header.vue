<template>
  <header class="pt3 pb3 flex items-center justify-between">
    <div class="flex items-center">
      <p
        v-if="selectedUsersNum"
        class="mv0">
        Selected {{ setPluralize('user', selectedUsersNum) }}
      </p>
      <p
        v-else
        class="mv0">
        Showing {{ usersNum }} out of {{ setPluralize('user', usersNum) }}
      </p>
    </div>

    <div class="flex items-center">
      <div
        v-if="anyUsersSelected"
        class="br b--light-gray pr3 flex items-center mr3">
        <miso-button
          type="outline"
          @click="onShowDeleteModal">
          Delete
        </miso-button>
      </div>

      <miso-button
        type="primary"
        class="dark-gray"
        @click="onShowSidePanel('UserForm')">
        New User
      </miso-button>
    </div>
  </header>
</template>

<script>
  import { mapGetters } from 'vuex'
  import pluralize from 'pluralize'

  import {
    MisoButton,
    MisoButtonLink,
    MisoMessage,
    FeatherIcon
  } from 'miso'

  export default {
    name: 'settings-users-table-header',

    props: [
      'isFilterVisible',
      'onToggleFilterVisible',
      'onShowSidePanel',
      'sidePanelView',
      'onShowDeleteModal',
      'reviewTaskUrl',
    ],

    components: {
      MisoButton,
      MisoButtonLink,
      MisoMessage,
      FeatherIcon
    },

    computed: {
      ...mapGetters([
        'usersNum',
        'selectedUsersNum',
        'anyUsersSelected'
      ])
    },

    methods: {
      setPluralize (word, number) {
        return pluralize(word, number, true)
      }
    }
  }
</script>
