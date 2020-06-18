<template>
  <div class="flex flex-auto">

    <notes-filter :visible="isFilterVisible" :destination="destination"></notes-filter>

    <div class="flex-auto ph3">

      <notes-table-header
        :side-panel-view="sidePanelView"
        :is-filter-visible="isFilterVisible"
        :on-show-side-panel="onShowSidePanel"
        :on-show-delete-modal="showDeleteModal"
        :on-toggle-filter-visible="toggleFilterVisible">
      </notes-table-header>

      <notes-table-body
        :destination="destination"
        :on-row-click="onRowClick">
      </notes-table-body>

      <div class="bg-white bl bb br b--purple-gray z-9999 pa3 tr">

        <miso-pagination
          layout="prev, pager, next"
          @current-change="updateNotePage"
          :pageSize="25"
          :total="notesNum">
        </miso-pagination>

      </div>
    </div>

    <notes-modal-delete
      :destination="destination"
      :is-visible="isDeleteModalVisible"
      :on-hide-delete-modal="hideDeleteModal"
      :on-delete-notes="onDeleteNotes">
    </notes-modal-delete>

  </div>
</template>

<script>
  import Vue from 'vue'

  import { mapState, mapActions, mapGetters } from 'vuex'

  import {
    MisoSidePanel,
    MisoPagination,
    MisoMessage
  } from 'miso'

  import NotesFilter from '#/components/notes/notes-filter'

  import NotesTableHeader from '#/components/notes/notes-table-header'
  import NotesTableBody from '#/components/notes/notes-table-body'

  import CreateNoteForm from '#/components/notes/create-note-form'
  import EditNoteForm from '#/components/notes/edit-note-form'

  import NotesModalDelete from '#/components/notes/notes-modal-delete'

  export default {
    name: 'notes-table',

    props: [
      'isSidePanelVisible',
      'onShowSidePanel',
      'onHideSidePanel',
      'onRowClick',
      'sidePanelView',
      'destination'
    ],

    components: {
      MisoSidePanel,
      MisoPagination,
      MisoMessage,

      NotesFilter,
      NotesTableHeader,
      NotesTableBody,

      CreateNoteForm,
      EditNoteForm,

      NotesModalDelete
    },

    data () {
      return {
        isFilterVisible: false,
        isDeleteModalVisible: false
      }
    },

    computed: {
      ...mapState({
        account: state => state.accounts.account && state.accounts.account.id,
        contact: state => state.contacts.contact && state.contacts.contact.id
      }),

      ...mapGetters(['notesNum', 'selectedNotesNum'])
    },

    methods: {
      ...mapActions([
        'updateNotePage',
        'deleteNotes'
      ]),

      toggleFilterVisible () {
        this.isFilterVisible = !this.isFilterVisible
      },

      showDeleteModal () {
        this.isDeleteModalVisible = true
      },

      hideDeleteModal () {
        this.isDeleteModalVisible = false
      },

      onDeleteNotes () {
        this.hideDeleteModal()

        let id = this.getDestinationId()

        if (this.destination === 'account') {
          id = this.account
        } else if (this.destination === 'contact') {
          id = this.contact
        }

        this.deleteNotes({ id, destination: this.destination })
            .then(() => MisoMessage.success(`Successfully deleted ${this.selectedNotesNum} notes`))
            .catch(() => MisoMessage.error(`Failed to delete ${this.selectedNotesNum} notes`))
      },

      getDestinationId () {
        let id = null

        if (this.destination === 'account') {
          id = this.account
        } else if (this.destination === 'contact') {
          id = this.contact
        }
        return id
      }
    }
  }
</script>
