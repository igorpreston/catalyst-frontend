<template>
  <div class="flex">
    <notes-table
      destination="contact"
      v-if="!noteView"
      :on-show-side-panel="onShowSidePanel"
      :on-row-click="showNoteView"/>

    <notes-view
      destination="contact"
      v-if="noteView"
      :note="noteView"
      :on-close="closeNoteView"
      :on-show-side-panel="onShowSidePanel"/>
  </div>
</template>

<script>
import Vue from 'vue'

import { mapMutations, mapGetters, mapActions } from 'vuex'

import NotesTable from '#/components/notes/notes-table'
import NotesView from '#/components/notes/notes-view'

export default {
  name: 'ContactsDetailTabsNotes',

  components: {
    NotesTable,
    NotesView
  },

  props: ['onShowSidePanel'],

  computed: {
    ...mapGetters(['noteView'])
  },

  data () {
    return {
      sidePanelView: null,
      isSidePanelVisible: false
    }
  },

  methods: {
    ...mapMutations([
      'setNoteViewId',
      'setSelectedNotes',
      'setNoteFields'
    ]),

    ...mapActions(['clearNoteTasks']),

    showSidePanel (view) {
      this.isSidePanelVisible = true
      this.sidePanelView = view
    },

    hideSidePanel () {
      this.isSidePanelVisible = false
      this.clearNoteTasks()
      this.setNoteFields([])
      this.sidePanelView = null
    },

    showNoteView (row) {
      this.setNoteViewId(row.id)
    },

    closeNoteView () {
      this.setNoteViewId(-1)
      this.setSelectedNotes([])
    }
  }
}
</script>
