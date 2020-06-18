<template>
  <header class="flex items-center justify-between pb3">

    <div class="flex items-center">
      <div class="br b--light-gray mr3">
        <miso-button
          v-if="!isFilterVisible"
          class="mr2 purple"
          type="outline"
          @click="onToggleFilterVisible">
          <div class="flex items-center">
            Filter items
          </div>
        </miso-button>
      </div>

      <p
        v-if="anyPlaybooksSelected"
        class="mv0">{{ selectedPlaybooksNum }} playbooks selected</p>

      <p
        v-else
        class="mv0 ml1 f6">Showing {{ filteredPlaybooks.length }} out of {{ playbooksNum }} playbooks</p>
    </div>

    <div class="flex items-center">
      <div
        v-if="anyPlaybooksSelected"
        class="br b--light-gray pr3 flex items-center mr3">
        <miso-button
          v-if="singlePlaybookSelected"
          class="mr2"
          type="outline"
          @click="openEditPlaybookForm">
          Edit
        </miso-button>

        <miso-button
          type="outline"
          @click="onShowDeleteModal">
          Delete
        </miso-button>
      </div>

      <miso-button
        type="primary"
        class="dark-gray"
        @click="openCreatePlaybookForm">
        New Playbook
      </miso-button>
    </div>
  </header>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  MisoButton,
  FeatherIcon,
  MisoDropdown,
  MisoDropdownMenu,
  MisoDropdownItem
} from 'miso'

export default {
  name: 'PlaybooksTableHeader',

  components: {
    MisoButton,
    FeatherIcon,
    MisoDropdown,
    MisoDropdownMenu,
    MisoDropdownItem
  },

  props: [
    'sidePanelView',
    'isFilterVisible',
    'onShowSidePanel',
    'onShowDeleteModal',
    'onToggleFilterVisible',
    'onShowEditForm',
    'onHideEditForm'
  ],

  computed: {
    ...mapGetters(['playbooksNum', 'filteredPlaybooks', 'anyPlaybooksSelected', 'singlePlaybookSelected', 'selectedPlaybooksNum'])
  },
  methods: {
    openCreatePlaybookForm () {
      this.onShowSidePanel('PlaybooksForm')
    },

    openEditPlaybookForm () {
      this.onShowEditForm()
    }
  }
}
</script>
