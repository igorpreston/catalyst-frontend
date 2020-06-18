<template>
  <header class="pt3 pb3 flex items-center justify-between">
    <p
      v-if="anyNotesSelected"
      class="mv0 f6">
      {{ selectedNotesNum }}
      notes selected
    </p>

    <p
      v-else
      class="mv0 f6">
      Showing
      {{ filteredNotesNum }}
      out of
      {{ notesNum }}
      notes
    </p>

    <div
      class="pa1 pl3 flex items-center"
      v-if="anyNotesSelected">
      <miso-button
        v-if="singleNoteSelected"
        class="mr2"
        type="outline"
        @click="onShowSidePanel('EditNoteForm')">
        Edit
      </miso-button>

      <miso-button
        type="outline"
        @click="onShowDeleteModal">
        Delete
      </miso-button>
    </div>
  </header>
</template>

<script>
  import Vue from 'vue'

  import { mapActions, mapGetters } from 'vuex'

  import {
    MisoButton,
    MisoMessage,
    FeatherIcon
  } from 'miso'

  export default {
    name: 'notes-table-header',

    props: [
      'isFilterVisible',
      'onToggleFilterVisible',
      'onShowSidePanel',
      'sidePanelView',
      'onShowDeleteModal'
    ],

    components: {
      MisoButton,
      MisoMessage,
      FeatherIcon
    },

    computed: {
      ...mapGetters([
        'selectedNotesNum',
        'anyNotesSelected',
        'singleNoteSelected',
        'notesNum',
        'filteredNotesNum'
      ])
    }
  }
</script>

<style scoped>
  header {
    height: 64px;
  }
</style>
