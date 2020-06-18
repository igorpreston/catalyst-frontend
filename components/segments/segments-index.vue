<template>
  <main
    id="segments"
    :class="isBodyScrolling"
    class="bg-off-purple vh-100 flex flex-column">
    <div
      v-if="mode && mode !== 'pre-create'"
      class="flex flex-auto flex-column">
      <segments-mode-header
        :on-show-side-panel="showSidePanel"
        :on-hide-side-panel="hideSidePanel"
        :segment-name="segmentFormData.name || getCurrentSegment.name"/>

      <div class="flex flex-auto relative">
        <segments-mode-body
          :side-panel-view="sidePanelView"
          :is-side-panel-visible="isSidePanelVisible"
          :on-show-side-panel="showSidePanel"
          :on-hide-side-panel="hideSidePanel"
          :set-mode="setMode"
          :humanized-string="humanizedString"/>

        <div
          v-if="isExpandedAside"
          class="side-panel-bg"/>

        <miso-side-panel
          :visible="isSidePanelVisible"
          :width="panelWidth"
          :style="panelWidthCss"
          :class="isExpanded"
          class="side-panel">
          <component
            :on-hide-side-panel="hideSidePanel"
            :on-show-side-panel="showSidePanel"
            :on-toggle-panel="togglePanel"
            :expanded="isExpandedAside"
            :mode="mode"
            :set-mode="setMode"
            :is="sidePanelView"/>
        </miso-side-panel>

      </div>
    </div>
    <div
      v-else
      class="flex flex-auto flex-column">
      <segments-header
        :on-show-side-panel="showSidePanel"/>

      <div class="flex flex-auto relative">

        <segments-table
          :side-panel-view="sidePanelView"
          :is-side-panel-visible="isSidePanelVisible"
          :on-show-side-panel="showSidePanel"
          :on-hide-side-panel="hideSidePanel"
          :handle-command="handleCommand"
          :set-mode="setMode"
          :humanized-string="humanizedString"/>

        <div
          v-if="isExpandedAside"
          class="side-panel-bg"/>

        <miso-side-panel
          :visible="isSidePanelVisible"
          :width="panelWidth"
          :style="panelWidthCss"
          :class="isExpanded"
          class="side-panel">
          <component
            :on-hide-side-panel="hideSidePanel"
            :on-show-side-panel="showSidePanel"
            :on-toggle-panel="togglePanel"
            :expanded="isExpandedAside"
            :mode="mode"
            :set-mode="setMode"
            :is="sidePanelView"/>
        </miso-side-panel>

      </div>
    </div>
  </main>
</template>

<script>
import {
  MisoSidePanel
} from 'miso'

import _ from 'lodash'

import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'

import SegmentsHeader from '#/components/segments/segments-header'
import SegmentsTable from '#/components/segments/segments-table'
import SegmentsModeHeader from '#/components/segments/segments-mode-header'
import SegmentsModeBody from '#/components/segments/segments-mode-body'
import SegmentsNameForm from '#/components/segments/segments-name-form'
import SegmentsDetailActivity from '#/components/segments/segments-detail-activity'

import CreateTemplateForm from '#/components/templates/create-template-form'
import EditTemplateForm from '#/components/templates/edit-template-form'

import CreateEmailTemplateForm from '#/components/templates/create-email-template-form'
import EditEmailTemplateForm from '#/components/templates/edit-email-template-form'

import CreateEmailForm from '#/components/emails/create-email-form'

import CreateTaskForm from '#/components/tasks/create-task-form'
import EditTaskForm from '#/components/tasks/edit-task-form'

import CreateNoteForm from '#/components/notes/create-note-form'
import EditNoteForm from '#/components/notes/edit-note-form'

import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'
import EditNoteTaskForm from '#/components/tasks/edit-note-task-form'

export default {
  name: 'SegmentsIndex',

  components: {
    MisoSidePanel,

    SegmentsHeader,
    SegmentsTable,
    SegmentsModeHeader,
    SegmentsModeBody,
    SegmentsNameForm,
    SegmentsDetailActivity,

    CreateEmailForm,

    CreateTemplateForm,
    EditTemplateForm,

    CreateEmailTemplateForm,
    EditEmailTemplateForm,

    CreateTaskForm,
    EditTaskForm,

    CreateNoteForm,
    EditNoteForm,

    CreateNoteTaskForm,
    EditNoteTaskForm
  },

  data () {
    return {
      isSidePanelVisible: false,
      sidePanelView: null,
      isExpandedAside: false,
      panelWidth: 341,
      segmentName: null,
      filters: [
        {
          field: '',
          operator: '',
          value: ''
        }
      ]
    }
  },

  computed: {
    ...mapState({
      user_id: state => state.auth.currentUser && state.auth.currentUser.id,
      selected: state => state.segments.selected.length,
      salesforceUsers: state => state.salesforceUsers
    }),

    ...mapGetters([
      'selectedSegmentsNum',
      'anySegmentsSelected',
      'singleSegmentSelected',
      'segmentFormData',
      'getCurrentSegment'
    ]),

    ...mapState({
      mode: state => state.segments.mode
    }),

    isExpanded () {
      if (this.isExpandedAside) {
        return 'is-expanded'
      }
    },

    panelWidthCss () {
      return {
        width: this.panelWidth + 'px'
      }
    },

    isSegmentIncomplete () {
      return _.reduce(this.segmentFormData.terms, (result, row) => {
        return result || !this.isRowComplete(row)
      }, _.isEmpty(this.segmentFormData.name))
    },

    isBodyScrolling () {
      if (this.segmentFormData.terms.length > 4) {
        return 'overflow-y-auto'
      } else if (this.segmentFormData.terms.length <= 1) {
        return 'overflow-hidden'
      } else {
        return ''
      }
    }
  },

  beforeMount () {
    this.fetchSalesforceUsers()
    this.handleSegmentFilter()
  },

  methods: {
    ...mapActions([
      'fetchSegments',
      'saveSegment',
      'handleSegmentFilter',
      'setSegmentView',
      'fetchSalesforceUsers',
      'updateSegmentMode',
      'updateSegmentFormData'
    ]),

    ...mapMutations([
      'setTemplateFields',
      'setTemplateTasks'
    ]),

    showSidePanel (view) {
      this.isSidePanelVisible = true
      this.sidePanelView = view
      this.isExpandedAside = false
      this.panelWidth = 341
    },

    hideSidePanel () {
      this.isSidePanelVisible = false
      this.sidePanelView = null
      this.isExpandedAside = false

      this.setTemplateFields([])
      this.setTemplateTasks([])
      this.panelWidth = 0
    },

    togglePanel () {
      this.isExpandedAside = !this.isExpandedAside
      switch (this.panelWidth) {
        case 341:
          this.panelWidth = 730
          break
        case 730:
          this.panelWidth = 341
          break
        default:
      }
    },

    isRowComplete (row) {
      const noValueRow = row.operator === 'blank' || row.operator === 'present'
      return row && row.field && ((row.operator && row.value) || noValueRow)
    },

    handleCommand (command) {
      this.updateSegmentFormData({ key: 'type', value: command })
      this.setMode('pre-create')
    },

    setMode (mode) {
      this.updateSegmentMode(mode)

      switch (mode) {
        case 'pre-create':
          this.showSidePanel('SegmentsNameForm')
          return
        case 'create':
          this.hideSidePanel()
          return
        case 'view':
          this.hideSidePanel()
          this.setSegmentView()
          this.handleSegmentFilter()
          return
        case 'edit':
          this.hideSidePanel()
          this.handleSegmentFilter()
      }
    },
    humanizedString (field, operator, value) {
      let newField = _.startCase(field)
      let newOperator = ''
      let newValue = ''

      if (field === 'contract_value') {
        newValue = ` $${value}`
      } else if (field === 'owner_id') {
        newField = 'owner'
        const sfUser = this.salesforceUsers.all
          .find(salesforceUser => salesforceUser.id === value)
        newValue = ` "${sfUser && sfUser.full_name}"`
      } else if (value) {
        newValue = ` "${value}"`
      } else {
        newValue = ''
      }

      switch (operator) {
        case 'equal':
          newOperator = 'equals'
          break
        case 'not_equal':
          newOperator = 'not equal to'
          break
        case 'cont':
          newOperator = 'contains'
          break
        case 'not_cont':
          newOperator = 'does not contain'
          break
        case 'blank':
          newOperator = 'is blank'
          break
        case 'present':
          newOperator = 'is present'
          break
        case 'less_than':
          newOperator = 'is less than'
          break
        case 'greater_than':
          newOperator = 'is greater than'
          break
        default:
          newOperator = operator
      }

      return `${newField} ${newOperator}${newValue}`
    }
  }
}
</script>

<style lang="scss">
  .side-panel {
    flex: 0 0 341px;

    &-bg {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.2);
      z-index: 2;
    }
  }

  .is-expanded {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    flex: 0 0 730px;
    z-index: 10;
  }
</style>
