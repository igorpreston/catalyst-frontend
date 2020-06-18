<template>
  <main
    id="accounts"
    class="bg-off-purple vh-100 overflow-hidden flex flex-column">
    <accounts-header :on-show-side-panel="showSidePanel"/>

    <div class="flex flex-auto relative">
      <div class="w-100 pa24 overflow-y-auto">
        <div class="flex flex-auto justify-between f6 segments__header">
          <div class="flex flex-auto items-center">
            <p class="ma0 f6 pr2">
              {{ headerText }}
            </p>

            <div
              v-for="(term, index) in segmentFormData.terms"
              :key="'label'+index">
              <miso-tag
                v-if="isRowComplete(term) && mode !== 'filter'"
                :closable="true"
                class="ml2"
                type="gray"
                @close="onDeleteTerm(index)">
                <span>
                  {{ humanizedString(term.field, term.operator, term.value) }}
                </span>
              </miso-tag>
            </div>
          </div>

          <div class="flex flex-0 justify-end">
            <div
              v-if="mode === 'filter'"
              class="flex flex-auto mr3 pr3 br b--light-gray">
              <miso-button
                :disabled="isSegmentIncomplete"
                type="outline"
                @click="onAddTerm">
                Add Row
              </miso-button>
            </div>

            <miso-button
              v-if="!mode"
              type="outline"
              @click="setMode('filter')">
              Filter
            </miso-button>

            <miso-button
              v-if="mode === 'filter'"
              type="outline"
              @click="onApplyFilter">
              Apply
            </miso-button>
          </div>
        </div>

        <div
          v-if="mode === 'filter'"
          class="mt3">
          <div
            v-for="(term, index) in segmentFormData.terms"
            :key="index"
            class="flex flex-row">
            <span class="flex items-center f6 fw5 mr3">{{ index + 1 }}.</span>

            <segments-filter-row
              :index="index"
              :filter-field="term.field"
              :filter-operator="term.operator"
              :filter-value="term.value"
              :filter-type="segmentFormData.type" />

            <miso-button
              class="delete-row"
              type="transparent"
              @click="onDeleteTerm(index)">
              <feather-icon
                color="light-gray-accent"
                height="16"
                name="x-circle"
                type="transparent"
                width="16"/>
            </miso-button>
          </div>
        </div>

        <img
          v-if="isJustworks"
          :src="assetsHost + '/images/account-life-cycle-overview.png'">

        <accounts-table
          :class="tableClass"
          class="mt3"/>
      </div>
      <div
        v-if="isExpandedAside"
        class="z-10 side-panel-bg"/>

      <miso-side-panel
        :visible="isSidePanelVisible"
        :width="panelWidth"
        :style="panelWidthCss"
        :class="isExpanded"
        class="z-10 side-panel">
        <component
          :on-hide-side-panel="hideSidePanel"
          :on-show-side-panel="showSidePanel"
          :on-toggle-panel="togglePanel"
          :expanded="isExpandedAside"
          :is="sidePanelView"
          destination="dashboard"/>
      </miso-side-panel>
    </div>
  </main>
</template>

<script>
import _ from 'lodash'
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import {
  FeatherIcon,
  MisoButton,
  MisoInput,
  MisoSidePanel,
  MisoMessage,
  MisoTag
} from 'miso'

import SegmentsFilterRow from '#/components/segments/segments-filter-row'
import AccountsHeader from '#/components/accounts/accounts-header'
import AccountsTable from '#/components/accounts/accounts-table'
import CreateEmailForm from '#/components/emails/create-email-form'
import CreateTaskForm from '#/components/tasks/create-task-form'
import EditTaskForm from '#/components/tasks/edit-task-form'
import TasksRescheduleForm from '#/components/tasks/tasks-reschedule-form'
import CreateNoteForm from '#/components/notes/create-note-form'
import EditNoteForm from '#/components/notes/edit-note-form'
import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'

export default {
  name: 'AccountsIndex',

  components: {
    AccountsHeader,
    SegmentsFilterRow,
    AccountsTable,
    CreateEmailForm,
    CreateNoteForm,
    CreateNoteTaskForm,
    CreateTaskForm,
    EditNoteForm,
    EditTaskForm,
    FeatherIcon,
    MisoButton,
    MisoInput,
    MisoMessage,
    MisoSidePanel,
    MisoTag,
    TasksRescheduleForm
  },

  data () {
    return {
      segmentName: '',
      isSidePanelVisible: false,
      sidePanelView: null,
      isExpandedAside: false,
      panelWidth: 341,
      mode: null
    }
  },

  computed: {
    ...mapState({
      userId: state => state.auth.currentUser && state.auth.currentUser.id,
      page: state => state.accounts.page,
      pageSize: state => state.accounts.pageSize,
      total: state => state.accounts.total,
      count: state => state.accounts.count,
      accounts: state => state.accounts,
      salesforceUsers: state => state.salesforceUsers
    }),

    ...mapGetters([
      'segmentFormData',
      'isJustworks',
      'assetsHost'
    ]),

    panelWidthCss () {
      return {
        width: this.panelWidth + 'px'
      }
    },
    isSegmentIncomplete () {
      return _.reduce(this.segmentFormData.terms, (result, row) => {
        return result || !this.isRowComplete(row)
      }, false)
    },

    isExpanded () {
      if (this.isExpandedAside) {
        return 'is-expanded'
      }

      return ''
    },

    startIndex () {
      if (this.accounts.all.length === 0) {
        return 0
      } else {
        return (this.page - 1) * this.pageSize + 1
      }
    },

    endIndex () {
      const maxSize = this.page * this.pageSize
      return maxSize > this.total ? this.total : maxSize
    },

    headerText () {
      if (this.total === 0) {
        return `Showing 0 accounts`
      } else {
        return `Showing ${this.startIndex} - ${this.endIndex} out of ${this.total} accounts`
      }
    },

    tableClass () {
      if (!this.mode) {
        return 'full-height-table mt3'
      }
      if (this.segmentFormData.terms.length < 5) {
        return `full-height-table__filters--${this.segmentFormData.terms.length} mt24`
      } else {
        return `full-height-table__filters--many mt24`
      }
    }
  },

  beforeMount () {
    this.fetchSalesforceUsers()
    this.setSegmentFormData({ key: 'type', value: 'Account' })
  },

  methods: {
    ...mapMutations([
      'setSegmentFormData',
      'addTerm',
      'deleteTerm'
    ]),

    ...mapActions([
      'clearNoteFields',
      'clearNoteTasks',
      'getAccounts',
      'handleSegmentFilter',
      'updateAccountsFiltered',
      'updatePage',
      'fetchSalesforceUsers'
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
      this.clearNoteTasks()
      this.clearNoteFields()
      this.isExpandedAside = false
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

    setMode (mode) {
      this.mode = mode
    },

    isRowComplete (row) {
      const noValueRow = row.operator === 'blank' || row.operator === 'present'
      return row && row.field && ((row.operator && row.value) || noValueRow)
    },

    onAddTerm () {
      this.handleSegmentFilter()
        .then(res => {
          MisoMessage.success(`Successfully filtered the ${this.segmentFormData.type}s`)
          this.addTerm()
        })
        .catch(() => {
          MisoMessage.error(`Failed to filter the ${this.segmentFormData.type}s`)
        })
    },

    onDeleteTerm (index) {
      this.deleteTerm(index)
      if (index === 0 && this.segmentFormData.terms.length === 1) {
        this.updateAccountsFiltered(false)
        this.setMode(null)
        this.updatePage(1)
        this.getAccounts({page: 1, per_page: this.pageSize})
      } else {
        this.handleSegmentFilter().then(res => MisoMessage.success(`Successfully filtered the ${this.segmentFormData.type}s`))
          .catch(() => {
            MisoMessage.error(`Failed to filter the ${this.segmentFormData.type}s`)
          })
      }
    },

    humanizedString (field, operator, value) {
      let newField = _.startCase(field)
      let newOperator = ''
      let newValue = value

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
        case 'not_cont':
          newOperator = 'does not contain'
          break
        case 'cont':
          newOperator = 'contains'
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

      if (field === 'contract_value') {
        newValue = `$${value}`
      }

      return `${newField} ${newOperator} ${newValue}`
    },

    onApplyFilter () {
      this.handleSegmentFilter()
        .then(res => {
          MisoMessage.success(`Successfully filtered the ${this.segmentFormData.type}s`)
        })
        .catch(() => {
          MisoMessage.error(`Failed to filter the ${this.segmentFormData.type}s`)
        })
      this.mode = null
    }
  }
}
</script>

<style lang="scss">
  .flex-0 {
    flex: 0 0 auto;
  }

  .side-panel {
    flex: 0 0 341px;

    &-bg {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.2);
      z-index: 2001;
    }
  }

  .is-expanded {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    flex: 0 0 730px;
    z-index: 2001;
  }

  .segments {
    &__input {
      flex: 0 0 190px;

      .white-input {
        height: 32px;
      }
    }

    &__header {
      .el-tag--gray {
        border: 1px solid #CACACF;
        border-radius: 0;
        background-color: transparent;
        color: #7E7F89;

        .el-icon-close {
          border-radius: 0;
          color: #6B6B76;
        }
      }
    }
  }

  .delete-row {
    height: 36px !important;
    padding: 0 .5rem;
  }
</style>
