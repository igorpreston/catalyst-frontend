<template>
  <div class="flex flex-auto">

    <templates-filter
      :visible="isFilterVisible"
      :on-toggle-filter-visible="toggleFilterVisible">
    </templates-filter>

    <component
      v-if="isTemplatePresent"
      :is="templateView"
      :on-show-side-panel="onShowSidePanel">
    </component>

    <!--<templates-view v-if="isTemplatePresent" :on-show-side-panel="onShowSidePanel"></templates-view>-->

    <div v-else class="flex-auto pa24">
      <templates-table-header
        :side-panel-view="sidePanelView"
        :is-filter-visible="isFilterVisible"
        :on-show-side-panel="onShowSidePanel"
        :on-show-delete-modal="showDeleteModal"
        :on-toggle-filter-visible="toggleFilterVisible">
      </templates-table-header>

      <templates-table-body></templates-table-body>

      <div class="bg-white bl bb br b--purple-gray z-9999 pa3 tr">

        <miso-pagination
          layout="prev, pager, next"
          @current-change="updateTemplatePage"
          :pageSize="25"
          :total="templatesNum">
        </miso-pagination>

      </div>

    </div>

    <templates-modal-delete
      :is-visible="isDeleteModalVisible"
      :on-hide-delete-modal="hideDeleteModal"
      :on-delete-templates="onDeleteTemplates">
    </templates-modal-delete>

  </div>
</template>

<script>
  import Vue from 'vue'

  import {
    MisoPagination,
    MisoMessage
  } from 'miso'

  import { mapGetters, mapActions } from 'vuex'

  import TemplatesFilter from '#/components/templates/templates-filter'

  import TemplatesTableHeader from '#/components/templates/templates-table-header'
  import TemplatesTableBody from '#/components/templates/templates-table-body'

  import TemplatesModalDelete from '#/components/templates/templates-modal-delete'

  import TemplatesView from '#/components/templates/templates-view'
  import TemplateViewEmail from '#/components/templates/templates-view-email'

  export default {
    name: 'templates-table',

    props: [
      'sidePanelView',
      'isSidePanelVisible',
      'onShowSidePanel',
      'onHideSidePanel'
    ],

    components: {
      MisoPagination,
      MisoMessage,

      TemplatesFilter,

      TemplatesTableHeader,
      TemplatesTableBody,

      TemplatesModalDelete,

      TemplatesView,
      TemplateViewEmail
    },

    data () {
      return {
        isFilterVisible: false,
        isDeleteModalVisible: false
      }
    },

    computed: {
      ...mapGetters([
        'templatesNum',
        'isTemplatePresent',
        'currentTemplate'
      ]),

      templateView () {
        if (!this.isTemplatePresent) {
          return
        }

        switch (this.currentTemplate.category) {
          case 'note':
            return 'TemplatesView'
          case 'email':
            return 'TemplateViewEmail'
        }
      }

    },

    methods: {
      ...mapActions(['updateTemplatePage', 'deleteTemplates']),

      toggleFilterVisible () {
        this.isFilterVisible = !this.isFilterVisible
      },

      showDeleteModal () {
        this.isDeleteModalVisible = true
      },

      hideDeleteModal () {
        this.isDeleteModalVisible = false
      },

      onDeleteTemplates () {
        this.hideDeleteModal()

        this.deleteTemplates()
            .then(() => MisoMessage.success(`Successfully deleted ${this.selectedTasksNum} templates`))
            .catch(() => MisoMessage.error(`Failed to delete ${this.selectedTasksNum} templates`))
      }
    }
  }
</script>
