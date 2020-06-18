<template>
  <div class="flex flex-auto">

    <playbooks-filter
      :visible="isFilterVisible"
      :on-toggle-filter-visible="toggleFilterVisible"/>

    <div class="flex-auto pa24">
      <playbooks-table-header
        :side-panel-view="sidePanelView"
        :is-filter-visible="isFilterVisible"
        :on-show-side-panel="onShowSidePanel"
        :on-show-delete-modal="showDeleteModal"
        :on-toggle-filter-visible="toggleFilterVisible"
        :on-show-edit-form="onShowEditForm"
        :on-hide-edit-form="onHideEditForm"/>

      <playbooks-table-body
        :on-show-playbook-view="onShowPlaybookView"
        :on-hide-side-panel="onHideSidePanel"/>

      <div class="bg-white bl bb br b--purple-gray z-9999 pa3 tr">

        <miso-pagination
          layout="prev, pager, next"
          :page-size="10"
          :page-count="10"
          :total="playbooksNum"
          @current-change="setPlaybooksPage"/>

      </div>

    </div>

    <playbooks-modal-delete
      :is-visible="isDeleteModalVisible"
      :on-hide-delete-modal="hideDeleteModal"
      :on-delete-playbooks="onDeletePlaybooks"/>

  </div>
</template>

<script>
import Vue from 'vue'
import { mapMutations, mapGetters, mapActions } from 'vuex'

import {
  MisoPagination,
  MisoMessage
} from 'miso'

import PlaybooksFilter from '#/components/playbooks/playbooks-filter'
import PlaybooksView from '#/components/playbooks/playbooks-view'

import PlaybooksTableHeader from '#/components/playbooks/playbooks-table-header'
import PlaybooksTableBody from '#/components/playbooks/playbooks-table-body'

import PlaybooksModalDelete from '#/components/playbooks/playbooks-modal-delete'

export default {
  name: 'PlaybooksTable',

  components: {
    MisoPagination,
    MisoMessage,

    PlaybooksFilter,

    PlaybooksView,

    PlaybooksTableHeader,
    PlaybooksTableBody,

    PlaybooksModalDelete
  },

  props: [
    'sidePanelView',
    'isSidePanelVisible',
    'onShowSidePanel',
    'onHideSidePanel',
    'onShowPlaybookView',
    'onShowEditForm',
    'onHideEditForm'
  ],

  data () {
    return {
      isFilterVisible: false,
      isDeleteModalVisible: false
    }
  },

  computed: {
    ...mapGetters(['playbooksNum', 'selectedPlaybooksNum'])
  },

  methods: {
    ...mapMutations(['setPlaybooksPage']),
    ...mapActions(['deletePlaybooks']),

    toggleFilterVisible () {
      this.isFilterVisible = !this.isFilterVisible
    },

    showDeleteModal () {
      this.isDeleteModalVisible = true
    },

    hideDeleteModal () {
      this.isDeleteModalVisible = false
    },

    onDeletePlaybooks () {
      this.deletePlaybooks()
        .then(() => {
          MisoMessage.success(`Successfully deleted ${this.selectedPlaybooksNum} segments`)
          this.hideDeleteModal()
        })
        .catch(() => MisoMessage.error(`Failed to delete ${this.selectedPlaybooksNum} segments`))
    }
  }
}
</script>
