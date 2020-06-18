<template>
  <div class="full-height-table">
    <div class="w-100 overflow-y-auto">
      <div class="flex flex-auto justify-between f6 segments__header">
        <div class="flex flex-auto items-center">
          <!-- TODO number of accounts is partly hardcoded because it relates to Contacts real pagination ticket (see CAT-491) -->
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

          <div
            v-if="selected"
            class="flex items-start">
            <div class="br b--light-gray pr3 mr3">
              <miso-button
                v-if="selected"
                type="outline"
                size="medium"
                @click="deleteModalVisible=true">
                Delete
              </miso-button>
            </div>
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
      <div v-if="mode === 'filter'">
        <div
          v-for="(term, index) in segmentFormData.terms"
          :key="index"
          class="flex flex-row mt3">
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
              type="transparent"
              name="x-circle"
              color="light-gray-accent"
              width="16"
              height="16"/>
          </miso-button>
        </div>
      </div>

      <contacts-table-body
        :class="tableClass"
        class="mt3"/>
    </div>

    <miso-modal :visible="deleteModalVisible">
      <header
        slot="title"
        class="flex items-center justify-between">
        <miso-heading
          level="3"
          class="mv0 ">Delete Selected Contacts</miso-heading>
        <miso-button
          type="transparent"
          @click="deleteModalVisible = false">
          <feather-icon
            color="mid-gray"
            width="24"
            height="24"
            name="x"/>
        </miso-button>
      </header>
      <div class="pa3">
        <p class="lh-copy f5 mv0">Deleting these contacts will permanently remove them. Are you sure you want to do this?</p>
      </div>
      <footer
        slot="footer"
        class="pa3">
        <miso-button
          class="mr2"
          type="default"
          @click="deleteModalVisible = false">Cancel</miso-button>
        <miso-button
          type="danger"
          @click="deleteContacts">Delete</miso-button>
      </footer>
    </miso-modal>
    <!--TODO: Add back campaign -->
    <!--<miso-modal :visible.sync="addToCampaignVisible">-->
    <!-- Header Slot -->
    <!--<header class="flex items-center justify-between" slot="title">
        <miso-heading level="3" class="mv0 ">Add to Campaign</miso-heading>
        <miso-button @click="addToCampaignVisible = false" type="transparent">
          <feather-icon color="mid-gray" width="24" height="24" name="x"></feather-icon>
        </miso-button>
      </header>-->
    <!-- Body Slot -->
    <!--<div class="pa3">
        <p class="lh-copy f5 mv0">Add the selected contacts to the following campaign</p>
        <miso-select
          filterable
          clearable
          class="w-100 vanilla-select f6"
          value-key="id"
          v-model="selectedCampaign"
          no-data-text="No campaigns">
          <miso-option v-for="campaign in campaigns" :value="campaign" :key="campaign.id" :label="campaign.name">
            <div>
              <p class="mv0">{{ campaign.name }}</p>
            </div>
          </miso-option>
        </miso-select>
      </div>-->
    <!-- Footer Slot -->
    <!--<footer class="pa3" slot="footer">
        <miso-button class="mr2" @click="addToCampaignVisible = false" type="default">Cancel</miso-button>
        <miso-button @click="addToCampaign" :disabled="disableAddToCampaign" type="primary">Add to Campaign</miso-button>
      </footer>
    </miso-modal>-->
  </div>
</template>

<script>
import _ from 'lodash'
import Raven from 'raven-js'
import {mapActions, mapState, mapMutations, mapGetters} from 'vuex'
import SegmentsFilterRow from '#/components/segments/segments-filter-row'
import ContactsTableBody from '#/components/contacts/contacts-table-body'
import axios from 'axios'
import {
  FeatherIcon,
  MisoButton,
  MisoButtonLink,
  MisoEmpty,
  MisoHeading,
  MisoInput,
  MisoMessage,
  MisoModal,
  MisoOption,
  MisoPagination,
  MisoSelect,
  MisoTable,
  MisoTableColumn,
  MisoTag
} from 'miso'

export default {
  name: 'ContactsTable',
  components: {
    SegmentsFilterRow,
    ContactsTableBody,
    FeatherIcon,
    MisoButton,
    MisoButtonLink,
    MisoEmpty,
    MisoHeading,
    MisoInput,
    MisoMessage,
    MisoModal,
    MisoOption,
    MisoPagination,
    MisoSelect,
    MisoTable,
    MisoTableColumn,
    MisoTag
  },

  data () {
    return {
      deleteModalVisible: false,
      segmentName: '',
      isSidePanelVisible: false,
      sidePanelView: null,
      isExpandedAside: false,
      panelWidth: 341,
      campaigns: [],
      selectedCampaign: {},
      mode: null
    }
  },

  computed: {
    ...mapState({
      contacts: state => state.contacts,
      userId: state => state.auth.currentUser && state.auth.currentUser.id,
      page: state => state.contacts.page,
      pageSize: state => state.contacts.pageSize,
      total: state => state.contacts.total,
      count: state => state.contacts.count,
      order: state => state.contacts.order,
      sortColumn: state => state.contacts.sortColumn,
      includes: state => state.contacts.includes,
      selectedContacts: state => state.contacts.selected
    }),

    ...mapGetters([
      'segmentFormData'
    ]),

    headerText () {
      if (this.total === 0) {
        return `Showing 0 contacts`
      } else {
        return `Showing ${this.startIndex} - ${this.endIndex} out of ${this.total} contacts`
      }
    },

    numOfSelected () {
      return this.selectedContacts.length
    },

    selected () {
      return this.selectedContacts.length > 0
    },

    disableAddToCampaign () {
      return _.isEmpty(this.selectedCampaign)
    },

    isSegmentIncomplete () {
      return _.reduce(this.segmentFormData.terms, (result, row) => {
        return result || !this.isRowComplete(row)
      }, false)
    },

    startIndex () {
      if (this.contacts.all.length === 0) {
        return 0
      } else {
        return (this.page - 1) * this.pageSize + 1
      }
    },

    endIndex () {
      const maxSize = this.page * this.pageSize
      return maxSize > this.total ? this.total : maxSize
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
    this.setSegmentFormData({key: 'type', value: 'Contact'})
    this.getContacts({page: this.page, per_page: this.pageSize})
  },
  methods: {
    ...mapMutations([
      'setSegmentFormData',
      'setSelectedContacts',
      'addTerm',
      'deleteTerm'
    ]),
    ...mapActions([
      'getContacts',
      'handleSegmentFilter',
      'updateContactsFiltered',
      'updatePage'
    ]),

    handleSelection (contactsArray) {
      this.selectedContacts = contactsArray
    },
    fetchContacts (page) {
      const params = {
        page: page,
        per_page: this.pageSize,
        prop: this.sortColumn,
        order: this.order,
        includes: this.includes
      }
      this.getContacts(params)
        .catch(() => MisoMessage.error('Failed to fetch the contacts'))
    },

    deleteContacts () {
      this.deleteModalVisible = false
      this.loadingText = 'Deleting contacts'
      this.loading = true
      let promises = _.map(this.selectedContacts, (val) => {
        return axios.delete(`/contacts/${val.id}`)
          .then((reponse) => console.log(`Deleted contact - ${val.id}`))
          .catch((_err) => console.log(`Error in deleting contact - ${val.id}`))
      })
      Promise.all(promises).then((result) => {
        this.setSelectedContacts([])

        if (this.isFiltered) {
          this.getFiltered(this.page)
        } else {
          this.fetchContacts(this.page)
        }

        this.loading = false
        this.loadingText = ''
        MisoMessage.info('The selected contacts have successfully been deleted')
      }).catch((_err) => MisoMessage.error('Failed to delete the selected contacts'))
    },
    addToCampaign () {
      this.addToCampaignVisible = false
      this.loadingText = 'Adding contacts to ' + this.selectedCampaign.name
      this.loading = true
      let promises = _.map(this.selectedContacts, (val) => {
        return axios.post(`/campaigns/${this.selectedCampaign.id}/contacts/${val.id}`)
          .then((reponse) => console.log(`Added Contact - ${val.id} to campaign ${this.selectedCampaign.id}`))
          .catch((_err) => console.log(`Error in adding contact to campaign - ${val.id}`))
      })
      Promise.all(promises).then((result) => {
        this.$refs.contactTable.clearSelection()
        this.selectedContacts = []
        this.loading = false
        this.loadingText = ''
        MisoMessage.info('The selected contacts have successfully been added to ' + this.selectedCampaign.name)
      }).catch((_err) => MisoMessage.error('Failed to add contacts to ' + this.selectedCampaign.name))
    },
    getCampaigns () {
      axios.get('/campaigns')
        .then((response) => {
          this.campaigns = response.data
        })
        .catch((err) => {
          Raven.captureException(err)
        })
    },

    setMode (mode) {
      this.mode = mode
    },

    setValue (key, value) {
      this.setSegmentFormData({ key, value })
    },

    isRowComplete (row) {
      const noValueRow = row.operator === 'blank' || row.operator === 'present'
      return row && row.field && ((row.operator && row.value) || noValueRow)
    },

    onAddTerm () {
      this.handleSegmentFilter().then(res => MisoMessage.success(`Successfully filtered the ${this.segmentFormData.type}s`))
        .catch((err) => {
          Raven.captureException(err)
          MisoMessage.error(`Failed to filter the ${this.segmentFormData.type}s`)
        })
      this.addTerm()
    },

    onDeleteTerm (index) {
      this.deleteTerm(index)
      if (index === 0 && this.segmentFormData.terms.length === 1) {
        this.updateContactsFiltered(false)
        this.setMode(null)
        this.updatePage(1)
        this.getContacts({page: 1, per_page: this.pageSize})
      } else {
        this.handleSegmentFilter().then(res => MisoMessage.success(`Successfully filtered the ${this.segmentFormData.type}s`))
          .catch((err) => {
            Raven.captureException(err)
            MisoMessage.error(`Failed to filter the ${this.segmentFormData.type}s`)
          })
      }
    },

    humanizedString (field, operator, value) {
      let newField = _.startCase(field)
      let newOperator = ''
      let newValue = value

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
      this.handleSegmentFilter().then(res => MisoMessage.success(`Successfully filtered the ${this.segmentFormData.type}s`))
        .catch((err) => {
          Raven.captureException(err)
          MisoMessage.error(`Failed to filter the ${this.segmentFormData.type}s`)
        })
      this.setMode(null)
    }
  }
}
</script>

<style lang="scss">
  .flex-0 {
    flex: 0 0 auto;
  }

  .main-content-inner {
    padding: 0;
  }
  .segments {
    &__input {
      flex: 0 0 190px;

      .white-input {
        height: 32px;
      }
    }
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

  .temporary {
    width: 64px;
  }

  .delete-row {
    height: 36px !important;
    padding: 0 .5rem;
  }
</style>
