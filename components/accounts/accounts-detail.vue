<template>
  <main
    id="accounts-detail"
    class="bg-off-purple overflow-hidden flex flex-auto flex-column">

    <accounts-detail-header
      v-if="isHeaderVisible"
      :on-show-side-panel="showSidePanel"/>

    <div class="flex flex-auto relative">

      <div class="flex flex-auto pa24">
        <accounts-detail-tabs
          :class="{ 'if-sidepanel' : isSidePanelVisible }"
          :on-show-side-panel="showSidePanel"
          :review-mode="reviewMode"
          :campaign-table-data="campaignTableData"/>
      </div>

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
          :is="sidePanelView"
          destination="account"/>
      </miso-side-panel>

    </div>

  </main>
</template>

<script>
import axios from 'axios'
import { mapState, mapActions } from 'vuex'
import {
  MisoMessage,
  MisoSidePanel
} from 'miso'
import AccountsDetailHeader from '#/components/accounts/accounts-detail-header'
import AccountsDetailTabs from '#/components/accounts/accounts-detail-tabs'
import CreateEmailForm from '#/components/emails/create-email-form'
import CreateNoteForm from '#/components/notes/create-note-form'
import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'
import CreateTaskForm from '#/components/tasks/create-task-form'
import EditNoteForm from '#/components/notes/edit-note-form'
import EditNoteTaskForm from '#/components/tasks/edit-note-task-form'
import EditTaskForm from '#/components/tasks/edit-task-form'
import TasksRescheduleForm from '#/components/tasks/tasks-reschedule-form'

export default {
  name: 'AccountsDetail',

  components: {
    AccountsDetailHeader,
    AccountsDetailTabs,
    CreateEmailForm,
    CreateNoteForm,
    CreateNoteTaskForm,
    CreateTaskForm,
    EditNoteForm,
    EditNoteTaskForm,
    EditTaskForm,
    MisoMessage,
    MisoSidePanel,
    TasksRescheduleForm
  },

  props: {
    isHeaderVisible: {
      type: Boolean,
      default: true
    },

    reviewMode: {
      type: Boolean,
      default: false
    },

    account_id: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      isSidePanelVisible: false,
      sidePanelView: null,
      contactName: '',
      editingContactRoles: false,
      editingSalesforceUserRoles: false,
      goBackUrl: '/accounts',
      selectedContacts: [],
      deleteModalVisible: false,
      addToCampaignVisible: false,
      loading: false,
      loadingText: '',
      campaigns: [],
      selectedCampaign: {},
      tickets: [],
      sidePanelVisible: false,
      activeComponent: '',
      ticket: {},
      isExpandedAside: false,
      panelWidth: 341
    }
  },

  computed: {
    ...mapState({
      account: state => state.accounts.account,
      accountCampaigns: state => state.accounts.account && state.accounts.account.campaigns,
      contacts: state => state.contacts,
      page: state => state.tasks.page
    }),

    campaignTableData () {
      if (this.accountCampaigns) {
        return this.accountCampaigns.map((campaign) => ({
          status: campaign.status,
          name: campaign.name,
          id: campaign.id
        }))
      }
    },

    isExpanded () {
      if (this.isExpandedAside) {
        return 'is-expanded'
      }
    },

    panelWidthCss () {
      return {
        width: this.panelWidth + 'px'
      }
    }
  },

  watch: {
    account: function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.fetchTasksByDestination(
          { page: this.page, destination: 'account' })
      }
    }
  },

  beforeMount () {
    this.fetchSalesforceUsers()
    this.fetchUsers().then(res => {
      if (this.$route.params.accountId) {
        return this.fetchAccount(this.$route.params.accountId).then(res => {
          return this.fetchTasksByDestination(
            { page: this.page, destination: 'account' })
        })
      }
    })
  },

  methods: {
    ...mapActions([
      'fetchCurrentUser',
      'fetchUsers',
      'fetchAccount',
      'fetchSalesforceUsers',
      'fetchTasksByDestination'
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
      this.panelWidth = 0
    },

    togglePanel () {
      this.isExpandedAside = !this.isExpandedAside
      switch (this.panelWidth) {
        case 341:
          this.panelWidth = 730
          return
        case 730:
          this.panelWidth = 341
      }
    },

    campaignUrl (campaignId) {
      return `/campaigns/${campaignId}`
    },

    closeSidePanel () {
      this.activeComponent = ''
      this.sidePanelVisible = false
    },

    star (operation) {
      axios.patch(`/accounts/${this.account_id}/` + operation)
        .catch(() => {
          MisoMessage.info(operation + ' account failed')
        })
    },

    toggle () {
      if (this.starred) {
        this.star('unstar')
      } else {
        this.star('star')
      }
    },
    // Mutations
    editSalesforceUserRoles () {
      this.editingSalesforceUserRoles = true
    },

    editContactRoles () {
      this.editingContactRoles = true
    },

    saveSalesforceUserRoles () {
      this.updateRoles(this.salesforceUserRoles)
      this.editingSalesforceUserRoles = false
    },

    saveContactRoles () {
      this.updateRoles(this.contactRoles)
      this.editingContactRoles = false
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
      z-index: 10;
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
