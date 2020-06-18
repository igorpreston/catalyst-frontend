<template>
  <div v-loading="loadingInProgress">
    <header class="flex pt3 pb3 mv2 ml3 items-center f6 contacts__header">
      <span>{{ tableHeaderText }} </span>

      <div
        v-if="selectedCount"
        class="bl b--light-gray ml2">
        <miso-button
          class="ml2 mr2"
          type="outline"
          size="small"
          @click="deleteAction">Delete</miso-button>
          <!-- TO-DO: move back for campaign <miso-button
          сlass="mr2"
          type="outline"
          size="small"
          @click="addToCampaignAction">Add to campaign</miso-button> -->
      </div>
    </header>

    <div class="flex-auto ph3">
      <miso-table
        ref="contactTable"
        :data="contacts.all"
        row-key="id"
        @selection-change="selectionChange">
        <div
          slot="empty"
          class="pv4">
          <miso-empty heading="No contacts"/>
        </div>
        <miso-table-column
          :reserve-selection="true"
          type="selection"
          width="45"/>
        <miso-table-column
          label="Name"
          prop="full_name"
          sortable>
          <template slot-scope="scope">
            <div class="flex items-center">
              <a
                :href="contactUrl(scope.row.id)"
                class="purple no-underline underline-hover f6 m">
                {{ scope.row.full_name }}
              </a>
            </div>
          </template>
        </miso-table-column>
        <miso-table-column
          label="Email"
          prop="email"
          sortable/>
        <miso-table-column
          label="Title"
          prop="title"
          sortable/>
        <miso-table-column
          label="Phone"
          prop="phone"
          sortable/>
      </miso-table>
    </div>

    <!-- Confirmation modal to delete the contact -->
    <miso-modal :visible="confirmationModalVisible">
      <header
        slot="title"
        class="flex items-center justify-between">
        <miso-heading
          level="3"
          class="mv0">
          Delete Selected Contacts
        </miso-heading>
        <miso-button
          type="transparent"
          @click="closeDeleteModalAction">
          <feather-icon
            color="mid-gray"
            width="24"
            height="24"
            name="x"/>
        </miso-button>
      </header>
      <div class="pa3 pt0">
        <p class="f5 ma0">
          Deleting these contacts will permanently remove them. Are you sure you want to do this?
        </p>
      </div>
      <footer
        slot="footer"
        class="pa3">
        <miso-button
          class="mr2"
          type="default"
          @click="closeDeleteModalAction">
          Cancel
        </miso-button>
        <miso-button
          type="danger"
          @click="deleteSubmit">
          Accept
        </miso-button>
      </footer>
    </miso-modal>

    <!--  Modal to add to a campaign -->
    <miso-modal :visible="campaignModalVisible">
      <header
        slot="title"
        class="flex items-center justify-between">
        <miso-heading
          level="3"
          class="mv0">
          Add to campaign
        </miso-heading>
        <miso-button
          type="transparent"
          @click="closeCampaignModalAction">
          <feather-icon
            color="mid-gray"
            width="24"
            height="24"
            name="x"/>
        </miso-button>
      </header>
      <div class="pa3 pt0">
        <p class="db f5 ma0">
          Add the selected contacts to the following campaign
        </p>
        <miso-select
          v-model="selectedCampaign"
          filterable
          clearable
          value-key="id"
          class="w-100 vanilla-select">
          <miso-option
            v-for="campaign in campaigns"
            :key="campaign.id"
            :value="campaign.id"
            :label="campaign.name"/>
        </miso-select>
      </div>
      <footer
        slot="footer"
        class="pa3">
        <miso-button
          class="mr2"
          type="default"
          @click="closeCampaignModalAction">
          Cancel
        </miso-button>
        <miso-button
          :disabled="!selectedCampaign"
          type="primary"
          @click="addToCampaignSubmit">
          Accept
        </miso-button>
      </footer>
    </miso-modal>

  </div>
</template>

<script>
import _ from 'lodash'

import { mapState, mapActions } from 'vuex'

import {
  FeatherIcon,
  MisoButton,
  MisoEmpty,
  MisoHeading,
  MisoLabel,
  MisoMessage,
  MisoModal,
  MisoOption,
  MisoSelect,
  MisoTable,
  MisoTableColumn
} from 'miso'

export default {
  name: 'AccountsDetailTabsContacts',

  components: {
    FeatherIcon,
    MisoButton,
    MisoEmpty,
    MisoHeading,
    MisoLabel,
    MisoMessage,
    MisoModal,
    MisoOption,
    MisoSelect,
    MisoTable,
    MisoTableColumn
  },

  data () {
    return {
      selected: [],
      selectedCampaign: null,
      confirmationModalVisible: false,
      campaignModalVisible: false
    }
  },

  computed: {
    ...mapState({
      account: state => state.accounts && state.accounts.account,
      contacts: state => state.contacts,
      campaigns: state => state.campaigns
    }),

    loadingInProgress () {
      return _.isEmpty(this.account)
    },

    contactsCount () {
      return this.contacts.all && this.contacts.all.length
    },

    selectedCount () {
      return this.selected.length
    },

    tableHeaderText () {
      if (!this.selectedCount) {
        return 'Showing ' + this.contactsCount + ' contacts'
      } else {
        return this.selectedCount + ' contacts selected'
      }
    }
  },

  watch: {
    account: function () {
      if (this.account) {
        this.fetchContactsByAccount(this.account.id)
      }
    }
  },

  methods: {
    // ...mapActions('account', ['deleteContacts', 'addContactsToCampaign']),
    ...mapActions(['fetchContactsByAccount', 'deleteContacts', 'addContactsToCampaign']),

    contactUrl (id) {
      return `/contacts/${id}`
    },

    selectionChange (contacts) {
      this.selected = _.map(contacts, 'id')
    },

    clearSelected () {
      this.selected = []
      this.$refs.contactTable.clearSelection()
    },

    clearSelectedCampaign () {
      this.selectedCampaign = null
    },

    deleteAction () {
      this.confirmationModalVisible = true
    },

    deleteSubmit () {
      this.deleteContacts(this.selected)
        .then(() => {
          this.clearSelected()
          MisoMessage.info('Successfully deleted the contacts')
        })
        .catch(() => MisoMessage.error('Something went wrong while deleting. Please try again later.'))
      this.closeDeleteModalAction()
    },

    closeDeleteModalAction () {
      this.confirmationModalVisible = false
    },

    addToCampaignAction () {
      this.campaignModalVisible = true
    },

    addToCampaignSubmit () {
      this.addContactsToCampaign([ this.selected, this.selectedCampaign ])
        .then(() => {
          this.clearSelected()
          MisoMessage.info('Successfully added to campaign')
        })
        .catch(() => MisoMessage.error('Something went wrong while deleting. Please try again later.'))
      this.closeCampaignModalAction()
    },

    closeCampaignModalAction () {
      this.clearSelectedCampaign()
      this.campaignModalVisible = false
    }
  }
}
</script>

<style scoped>
  .contacts__header {
    height: 48px;
  }
</style>
