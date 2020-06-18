<template>
  <miso-table
    :data="notes"
    row-key="id"
    class="full-height-table--inner"
    @selection-change="selectNotes"
    @row-click="rowClick">

    <div slot="empty">
      <miso-empty
        class="pv5"
        heading="No Notes"
        body="You're good to go!"/>
    </div>

    <miso-table-column type="selection"/>

    <miso-table-column
      label="Customer"
      prop="account.name"
      width="180">
      <template slot-scope="scope">
        <notes-table-account-column
          :account-name="scope.row.account.name"
          :account-id="scope.row.account.id"
          :contact-name="scope.row.created_by_name"
          :contact-title="scope.row.title"
          :contact-id="scope.row.contact_id"
        />
      </template>
    </miso-table-column>

    <miso-table-column
      label="Title"
      prop="title"
      sortable
      min-width="180">
      <template slot-scope="scope">
        <notes-table-title-column
          :title="scope.row.title"
        />
      </template>
    </miso-table-column>

    <miso-table-column
      label="Description"
      prop="content_plain"
      width="320">
      <template slot-scope="scope">
        <notes-table-description-column
          :description="scope.row.content_plain"
        />
      </template>
    </miso-table-column>

    <miso-table-column
      label="Created"
      prop="created_at"
      sortable
      width="140">
      <template slot-scope="scope">
        <notes-table-date-column :date="scope.row.created_at"/>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Updated"
      prop="updated_at"
      sortable
      width="140">
      <template slot-scope="scope">
        <notes-table-date-column :date="scope.row.updated_at"/>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Creator"
      prop="created_by_name"
      sortable
      width="180"/>

    <miso-table-column
      width="50"
      class-name="goto-note">
      <template slot-scope="scope">
        <feather-icon
          name="arrow-right"
          height="20"
          width="20"
          color="purple"
          class="goto-note__arrow ml-auto"/>
      </template>
    </miso-table-column>

  </miso-table>
</template>

<style lang="scss">

  .el-table--enable-row-hover .el-table__body tr:hover > td {
    cursor: pointer;
  }

  .goto-note {
    .cell {
      display: flex;
    }

    &__arrow {
      visibility: hidden;

      .el-table__row:hover & {
        visibility: visible;
      }
    }
  }
</style>

<script>
import _ from 'lodash'

import {
  MisoTable,
  MisoTableColumn,
  MisoEmpty,
  FeatherIcon
} from 'miso'

import { mapState, mapActions, mapGetters } from 'vuex'

import NotesTableAccountColumn from '#/components/notes/notes-table-account-column'
import NotesTableTitleColumn from '#/components/notes/notes-table-title-column'
import NotesTableDescriptionColumn from '#/components/notes/notes-table-description-column'
import NotesTableDateColumn from '#/components/notes/notes-table-date-column'

export default {
  name: 'NotesTableBody',

  components: {
    MisoTable,
    MisoTableColumn,
    MisoEmpty,

    NotesTableAccountColumn,
    NotesTableTitleColumn,
    NotesTableDescriptionColumn,
    NotesTableDateColumn,

    FeatherIcon
  },

  props: {
    destination: {
      type: String,
      default: null
    },
    onRowClick: {
      type: Function,
      default () {}
    }
  },

  computed: {
    ...mapGetters([
      'filteredNotes',
      'filteredNotesByAccount',
      'filteredNotesByContact'
    ]),

    ...mapState({
      account: state => state.accounts.account,
      contact: state => state.contacts.contact
    }),

    notes () {
      switch (this.destination) {
        case 'dashboard':
          return this.filteredNotes
        case 'account':
          return this.filteredNotesByAccount
        case 'contact':
          return this.filteredNotesByContact
        default:
          return this.filteredNotes
      }
    }
  },

  watch: {
    account: function () {
      if (this.destination === 'account') {
        const id = this.getDestinationId()
        if (id) this.fetchNotesByAccount(id)
      }
    },
    contact: function () {
      if (this.destination === 'contact') {
        const id = this.getDestinationId()
        if (id) this.fetchNotesByContact(id)
      }
    }
  },

  beforeMount: function () {
    // `this` points to the vm instance
    let id = this.getDestinationId()
    if (!id) return
    if (this.destination === 'dashboard') {
      this.fetchNotes()
    } else if (this.destination === 'account') {
      this.fetchNotesByAccount(id)
    } else if (this.destination === 'contact') {
      this.fetchNotesByContact(id)
    }
  },

  methods: {
    ...mapActions([
      'fetchNotes',
      'selectNotes',
      'fetchNotes',
      'fetchNotesByContact',
      'fetchNotesByAccount'
    ]),

    rowClick (row, event) {
      if (!_.some(['el-checkbox__original', 'el-checkbox__inner', 'link'],
        el => _.includes(event.target.className, el))) {
        this.onRowClick(row)
      }
    },

    getDestinationId () {
      let id = null

      if (this.destination === 'account') {
        id = this.account && this.account.id
      } else if (this.destination === 'contact') {
        id = this.contact && this.contact.id
      }
      return id
    }
  }
}
</script>
