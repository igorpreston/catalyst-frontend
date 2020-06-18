<template>
  <div class="flex flex-auto overflow-y-auto pa24">
    <segments-filter
      :visible="isFilterVisible"
      :on-toggle-filter-visible="toggleFilterVisible"
      :handle-check="handleCheck"/>

    <div class="flex-auto full-height-table">
      <segments-table-header
        :is-filter-visible="isFilterVisible"
        :on-toggle-filter-visible="toggleFilterVisible"
        :side-panel-view="sidePanelView"
        :on-show-side-panel="onShowSidePanel"
        :on-show-delete-modal="showDeleteModal"
        :segments-count="segments.length"
        :filtered-segments-count="filteredSegments.length"
        :handle-command="handleCommand"/>

      <segments-table-body
        :segments="paginatedSegments"
        :set-mode="setMode"
        :humanized-string="humanizedString"/>

      <div class="bg-white bl bb br b--purple-gray z-9999 pa3 tr">
        <miso-pagination
          :page-size="pageSize"
          :current-page.sync="page"
          :total="segments.length"
          layout="prev, pager, next"/>
      </div>

    </div>

    <segments-modal-delete
      :is-visible="isDeleteModalVisible"
      :on-hide-delete-modal="hideDeleteModal"
      :on-delete-segments="onDeleteSegments"/>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import _ from 'lodash'

import {
  MisoPagination,
  MisoMessage
} from 'miso'

import SegmentsFilter from '#/components/segments/segments-filter'
import SegmentsTableHeader from '#/components/segments/segments-table-header'
import SegmentsTableBody from '#/components/segments/segments-table-body'
import SegmentsModalDelete from '#/components/segments/segments-modal-delete'

export default {
  name: 'SegmentsTable',

  components: {
    MisoPagination,
    MisoMessage,

    SegmentsFilter,
    SegmentsTableHeader,
    SegmentsTableBody,
    SegmentsModalDelete
  },

  props: {
    sidePanelView: {
      type: String,
      default: ''
    },
    isSidePanelVisible: {
      type: Boolean,
      default: false
    },
    onShowSidePanel: {
      type: Function,
      default () {}
    },
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    handleCommand: {
      type: Function,
      default () {}
    },
    setMode: {
      type: Function,
      default () {}
    },
    humanizedString: {
      type: Function,
      default () {}
    }
  },
  data () {
    return {
      isFilterVisible: false,
      isDeleteModalVisible: false,
      page: 1,
      pageSize: 25,
      totalPage: 1
    }
  },

  computed: {
    ...mapState({
      segments: state => state.segments.all,
      filter: state => state.segments.filter
    }),

    paginatedSegments () {
      if (this.page === 1) {
        return _.take(this.filteredSegments, 25)
      }

      const perPage = 25
      const offset = (this.page - 1) * perPage

      const paginated = _(this.filteredSegments).drop(offset).take(perPage).value()

      return paginated
    },

    ...mapGetters([
      'selectedSegmentsNum',
      'accountSegments',
      'contactSegments'
    ]),

    filteredSegments () {
      if (this.filter.length === 2 || this.filter.length === 0) {
        return this.segments
      }

      if (this.filter.some(function (value) {
        return value === 'Account'
      })) {
        return this.accountSegments
      } else if (this.filter.some(function (value) {
        return value === 'Contact'
      })) {
        return this.contactSegments
      }
    }
  },

  methods: {
    ...mapActions([
      'fetchSegments',
      'deleteSegments'
    ]),

    ...mapMutations([
      'setFilter'
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

    onDeleteSegments () {
      this.hideDeleteModal()
      const selectedNum = this.selectedSegmentsNum

      this.deleteSegments()
        .then(() => MisoMessage.success(`Successfully deleted ${selectedNum} segments`))
        .catch(() => MisoMessage.error(`Failed to delete ${selectedNum} segments`))
    },

    handleCheck (filter) {
      this.setFilter(filter)
    }
  }
}
</script>
