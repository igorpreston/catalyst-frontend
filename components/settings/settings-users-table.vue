<template>
  <div class="flex flex-auto">
    <div class="flex-auto ph3 f6">
      <settings-users-table-header
        :side-panel-view="sidePanelView"
        :on-show-side-panel="onShowSidePanel"
        :on-show-delete-modal="showDeleteModal">
      </settings-users-table-header>

      <settings-users-table-body
        :destination="destination"
        :side-panel-view="sidePanelView"
        :on-show-side-panel="onShowSidePanel">
      </settings-users-table-body>

      <div class="bg-white bl bb br b--purple-gray z-9999 pa3 tr">
        <miso-pagination
          layout="prev, pager, next"
          :pageSize="10"
          :pageCount="10"
          :total="1">
        </miso-pagination>
      </div>
    </div>

    <settings-users-modal-delete
      :destination="destination"
      :is-visible="isDeleteModalVisible"
      :on-hide-delete-modal="hideDeleteModal"
      :on-delete-users="onDeleteUsers">
    </settings-users-modal-delete>
  </div>
</template>

<script>
  import {
    MisoSidePanel,
    MisoPagination,
    MisoMessage
  } from 'miso'

  import { mapState, mapGetters, mapActions } from 'vuex'

  import SettingsUsersTableHeader from '#/components/settings/settings-users-table-header'
  import SettingsUsersTableBody from '#/components/settings/settings-users-table-body'

  import CreateNoteForm from '#/components/notes/create-note-form'
  import EditNoteForm from '#/components/notes/edit-note-form'

  import SettingsUsersModalDelete from '#/components/settings/settings-users-modal-delete'

  export default {
    name: 'settings-users-table',

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

      SettingsUsersTableHeader,
      SettingsUsersTableBody,

      CreateNoteForm,
      EditNoteForm,

      SettingsUsersModalDelete
    },

    data () {
      return {
        isDeleteModalVisible: false
      }
    },

    computed: {
      ...mapState({
        users: state => state.users.all
      }),

      ...mapGetters(['selectedUsersNum'])
    },

    methods: {
      ...mapActions(['deleteUsers']),

      showDeleteModal () {
        this.isDeleteModalVisible = true
      },

      hideDeleteModal () {
        this.isDeleteModalVisible = false
      },

      onDeleteUsers () {
        this.deleteUsers()
            .then(() => MisoMessage.success(`Successfully deleted ${this.selectedUsersNum} users`))
            .catch(() => MisoMessage.error(`Failed to delete ${this.selectedUsersNum} users`))
        this.hideDeleteModal()
      }
    }
  }
</script>
