<template>
  <div class="flex">
    <notes-table
      v-if="!noteView"
      :on-show-side-panel="onShowSidePanel"
      :on-row-click="showNoteView"
      destination="account"/>

    <notes-view
      v-if="noteView"
      :note="noteView"
      :on-close="closeNoteView"
      :on-show-side-panel="onShowSidePanel"
      destination="account"/>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex'

import NotesTable from '#/components/notes/notes-table'
import NotesView from '#/components/notes/notes-view'

export default {
  name: 'AccountsDetailTabsNotes',

  components: {
    NotesTable,
    NotesView
  },

  props: {
    onShowSidePanel: {
      type: Function,
      default () {}
    }
  },

  data () {
    return {
      sidePanelView: null,
      isSidePanelVisible: false
    }
  },

  computed: {
    ...mapState({
      account: state => state.accounts.account
    }),
    ...mapGetters(['noteView'])
  },

  watch: {
    account: function () {
      if (this.account) {
        this.fetchNotesByAccount(this.account.id)
      }
    }
  },

  methods: {
    ...mapActions(['fetchNotesByAccount']),
    ...mapMutations([
      'setNoteViewId',
      'setSelectedNotes'
    ]),

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
