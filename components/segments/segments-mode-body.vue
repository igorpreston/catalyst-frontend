<template>
  <div class="flex flex-auto flex-column pa24">
    <header class="flex flex-0 justify-between segments__header">
      <div class="flex items-center">
        <el-tooltip
          placement="bottom-start">
          <feather-icon
            width="14"
            height="14"
            color="mid-gray"
            name="info"/>

          <div slot="content">
            <div v-if="isRowComplete(segmentFormData.terms[0])">
              <p
                v-for="(term, index) in segmentFormData.terms"
                :key="index"
                class="ma0">
                <span v-if="isRowComplete(segmentFormData.terms[index])">
                  {{ index + 1 }}.
                  {{ humanizedString(term.field, term.operator, term.value) }}
                </span>
              </p>
            </div>
            <p
              v-else
              class="ma0">
              Currently no filters applied
            </p>
          </div>
        </el-tooltip>

        <p class="mv0 ml2 mr3 f6">
          {{ headerText }}
        </p>

        <div
          v-for="(term, index) in segmentFormData.terms"
          :key="'label'+index">
          <miso-tag
            v-if="isRowComplete(term) && mode === 'view'"
            :closable="false"
            class="mr2"
            type="gray">
            <span>
              {{ humanizedString(term.field, term.operator, term.value) }}
            </span>
          </miso-tag>
        </div>
      </div>

      <div class="flex">
        <div
          v-if="mode === 'create' || mode === 'edit'"
          class="flex flex-auto pr3 br b--light-gray">
          <miso-button
            :disabled="isSegmentIncomplete"
            type="outline"
            @click="onAddTerm">
            Add Row
          </miso-button>
        </div>

        <div class="flex flex-auto ph3">
          <miso-button
            v-if="mode === 'create' || mode === 'edit'"
            :disabled="isSegmentIncomplete"
            class="mr2"
            type="outline"
            @click="onSaveSegment">
            Save
          </miso-button>

          <miso-button
            v-if="mode === 'view'"
            type="outline"
            class="mr2"
            @click="setMode('edit')">
            Edit
          </miso-button>

          <miso-button
            type="outline"
            @click="onShowSidePanel('SegmentsNameForm', true)">
            Rename
          </miso-button>
        </div>

        <div
          v-if="sidePanelView !== 'SegmentsDetailActivity'"
          class="pl3 bl b--light-gray flex flex-auto">
          <miso-button
            :disabled="mode === 'create'"
            class="mr2"
            type="primary"
            @click="onOpenTimeline">
            Timeline
          </miso-button>
        </div>
      </div>
    </header>

    <div
      v-if="segmentFormData.type && mode !== 'view'"
      class="flex flex-0 flex-column">
      <div
        v-for="(term, index) in segmentFormData.terms"
        :key="index"
        class="mt3">
        <div class="flex flex-row">
          <span class="flex items-center f6 fw5 mr3 index">{{ index + 1 }}.</span>

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
              type="transparent"
              name="x-circle"
              color="light-gray-accent"
              width="16"
              height="16"/>
          </miso-button>
        </div>
      </div>
    </div>

    <accounts-table
      v-if="isAccountSegment"
      :segment-page="true"
      :class="tableClass"/>
    <contacts-table
      v-if="isContactSegment"
      :segment-page="true"
      :class="tableClass"/>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import pluralize from 'pluralize'
import _ from 'lodash'

import { Tooltip } from 'element-ui'

import {
  FeatherIcon,
  MisoButton,
  MisoMessage,
  MisoTag
} from 'miso'

import AccountsTable from '#/components/accounts/accounts-table'
import ContactsTable from '#/components/contacts/contacts-table-body'
import SegmentsFilterRow from '#/components/segments/segments-filter-row'

export default {
  name: 'SegmentsModeBody',

  components: {
    'el-tooltip': Tooltip,
    FeatherIcon,
    MisoButton,
    MisoMessage,
    MisoTag,
    AccountsTable,
    ContactsTable,
    SegmentsFilterRow
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
    setMode: {
      type: Function,
      default () {}
    },
    humanizedString: {
      type: Function,
      default () {}
    }
  },

  computed: {
    ...mapState({
      accounts: state => state.accounts,
      contacts: state => state.contacts,
      mode: state => state.segments.mode
    }),

    ...mapGetters(['segmentFormData']),

    isAccountSegment () {
      return this.segmentFormData.type === 'Account'
    },

    isContactSegment () {
      return this.segmentFormData.type === 'Contact'
    },

    isSegmentIncomplete () {
      return _.reduce(this.segmentFormData.terms, (result, row) => {
        return result || !this.isRowComplete(row)
      }, _.isEmpty(this.segmentFormData.name))
    },

    currentPage () {
      if (this.isAccountSegment) {
        return this.accounts.page
      } else {
        return this.contacts.page
      }
    },

    pageSize () {
      if (this.isAccountSegment) {
        return this.accounts.pageSize
      } else {
        return this.contacts.pageSize
      }
    },

    startIndex () {
      if (this.isAccountSegment) {
        if (this.accounts.all.length === 0) {
          return 0
        } else {
          return (this.currentPage - 1) * this.pageSize + 1
        }
      } else {
        if (this.contacts.all.length === 0) {
          return 0
        } else {
          return (this.currentPage - 1) * this.pageSize + 1
        }
      }
    },

    endIndex () {
      const maxSize = this.currentPage * this.pageSize
      return maxSize > this.totalSize ? this.totalSize : maxSize
    },

    totalSize () {
      if (this.isAccountSegment) {
        return this.accounts.total
      } else {
        return this.contacts.total
      }
    },

    headerText () {
      if (this.totalSize === 0) {
        return `Showing 0 ${this.segmentFormData.type.toLowerCase()}`
      }
      return `Showing ${this.startIndex} - ${this.endIndex} out of ${this.totalSize} ${this.segmentFormData.type.toLowerCase()}s`
    },

    tableClass () {
      if (this.mode === 'view') {
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
    this.handleSegmentFilter()
  },

  methods: {
    ...mapActions([
      'getAccounts',
      'getContacts',
      'getSegmentActivities',
      'handleSegmentFilter',
      'resetTerms',
      'saveSegment',
      'updateAccountsFiltered',
      'updateContactsFiltered',
      'updateSegment',
      'fetchSalesforceUsers'
    ]),

    ...mapMutations([
      'addTerm',
      'setTerm',
      'deleteTerm',
      'deleteSingleTerm'
    ]),

    setPluralize (word, number) {
      return pluralize(word, number, true)
    },

    isRowComplete (row) {
      const noValueRow = row.operator === 'blank' || row.operator === 'present'
      return row && row.field && ((row.operator && row.value) || noValueRow)
    },

    onSaveSegment () {
      switch (this.mode) {
        case 'create':
          this.saveSegment()
            .then(() => MisoMessage.success('Succesfully saved a segment'))
            .catch(() => MisoMessage.error('Failed to save a segment'))
            // there is an error in the console: "Cannot read property 'name' of undefined", it doesn't affect the workflow, but to remove it, the showSidePanel and hideSidePanel need to be re-written in store in order to use setMode logic in store
          this.setMode('view')
          break
        case 'edit':
          this.updateSegment()
            .then(() => MisoMessage.success('Succesfully updated a segment'))
            .catch(() => MisoMessage.error('Failed to update a segment'))
          this.setMode('view')
          break
        default:
      }
    },

    onOpenTimeline () {
      this.getSegmentActivities()
      this.onShowSidePanel('SegmentsDetailActivity')
    },

    onAddTerm () {
      this.handleSegmentFilter().then(res => MisoMessage.success(`Successfully filtered the ${this.segmentFormData.type}s`))
        .catch(() => MisoMessage.error(`Failed to filter the ${this.segmentFormData.type}s`))
      this.addTerm()
    },

    onDeleteTerm (index) {
      if (this.segmentFormData.terms.length === 1) {
        this.resetTerms()
      } else {
        this.deleteTerm(index)
        this.handleSegmentFilter().then(res => MisoMessage.success(`Successfully filtered the ${this.segmentFormData.type}s`))
          .catch(() => MisoMessage.error(`Failed to filter the ${this.segmentFormData.type}s`))
      }
    }
  }
}
</script>

<style lang="scss">
  .segments__header {
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

  .index {
    width: 15px;
  }
</style>
