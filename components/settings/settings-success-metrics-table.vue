<template>
  <div class="flex flex-auto">
    <div class="flex-auto ph3 f6">
      <settings-success-metrics-table-header
        :side-panel-view="sidePanelView"
        :on-show-side-panel="onShowSidePanel"
        :on-show-delete-modal="showDeleteModal"
        :show-edit-form="showEditForm">
      </settings-success-metrics-table-header>

      <settings-success-metrics-table-body :destination="destination">
      </settings-success-metrics-table-body>

      <div class="bg-white bl bb br b--purple-gray z-9999 pa3 tr">
        <miso-pagination
          layout="prev, pager, next"
          :pageSize="10"
          :pageCount="10"
          :total="1">
        </miso-pagination>
      </div>
    </div>

    <settings-success-metrics-modal-delete
      :destination="destination"
      :is-visible="isDeleteModalVisible"
      :on-hide-delete-modal="hideDeleteModal"
      :on-delete-metrics="onDeleteMetrics">
    </settings-success-metrics-modal-delete>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import {
    MisoSidePanel,
    MisoPagination,
    MisoMessage
  } from 'miso'

  import SettingsSuccessMetricsTableHeader from '#/components/settings/settings-success-metrics-table-header'
  import SettingsSuccessMetricsTableBody from '#/components/settings/settings-success-metrics-table-body'

  import CreateNoteForm from '#/components/notes/create-note-form'
  import EditNoteForm from '#/components/notes/edit-note-form'

  import SettingsSuccessMetricsModalDelete from '#/components/settings/settings-success-metrics-modal-delete'

  export default {
    name: 'settings-success-metrics-table',

    props: [
      'isSidePanelVisible',
      'onShowSidePanel',
      'onHideSidePanel',
      'sidePanelView',
      'destination',
      'showEditForm'
    ],

    components: {
      MisoSidePanel,
      MisoPagination,
      MisoMessage,

      SettingsSuccessMetricsTableHeader,
      SettingsSuccessMetricsTableBody,

      CreateNoteForm,
      EditNoteForm,

      SettingsSuccessMetricsModalDelete
    },

    data () {
      return {
        isDeleteModalVisible: false
      }
    },

    computed: {
      ...mapGetters([
        'selectedMetricsNum'
      ])
    },

    methods: {
      ...mapActions(['deleteMetrics']),

      showDeleteModal () {
        this.isDeleteModalVisible = true
      },

      hideDeleteModal () {
        this.isDeleteModalVisible = false
      },

      onDeleteMetrics () {
        this.hideDeleteModal()

        this.deleteMetrics()
            .then(() => MisoMessage.success(`Successfully deleted ${this.selectedMetricsNum} metrics`))
            .catch(() => MisoMessage.error(`Failed to delete ${this.selectedMetricsNum} metrics`))
      }
    }
  }
</script>
