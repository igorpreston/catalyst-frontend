<template>
  <div class="flex flex-auto bg-white ba b--purple-gray overflow-hidden flex-1 accounts__tabs">

    <miso-tabs
      :class="ifOverflow"
      :value="activeTab"
      class="flex-auto"
      @tab-click="onTabClick">

      <miso-tab-pane
        name="overview"
        label="Overview">
        <accounts-detail-tabs-overview/>
      </miso-tab-pane>

      <miso-tab-pane
        name="contacts"
        label="Contacts">
        <accounts-detail-tabs-contacts/>
      </miso-tab-pane>
      <!--  TODO: Campaigns will be pulled back after beta -->
      <!-- <miso-tab-pane name="campaigns" label="Campaigns">
        <accounts-detail-tabs-campaigns
          :campaign-table-data="campaignTableData">
        </accounts-detail-tabs-campaigns>
      </miso-tab-pane> -->

      <miso-tab-pane
        name="activity"
        label="Activity Timeline">
        <accounts-detail-tabs-activity :is-active="activeTab === 'activity'"/>
      </miso-tab-pane>

      <miso-tab-pane
        name="product"
        label="Product Usage">
        <accounts-detail-tabs-product/>
      </miso-tab-pane>

      <miso-tab-pane
        name="notes"
        label="Notes">
        <accounts-detail-tabs-notes
          :on-show-side-panel="onShowSidePanel"
        />
      </miso-tab-pane>

      <miso-tab-pane
        v-if="isJustworks"
        class="h-100"
        name="tickets"
        label="Tickets">
        <accounts-detail-tabs-tickets class="h-100"/>
      </miso-tab-pane>

      <miso-tab-pane
        name="tasks"
        label="Tasks">
        <accounts-detail-tabs-tasks
          :review-mode="reviewMode"
          :on-show-side-panel="onShowSidePanel"/>
      </miso-tab-pane>

    </miso-tabs>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
  MisoTabs,
  MisoTabPane
} from 'miso'

import AccountsDetailTabsOverview from '#/components/accounts/accounts-detail-tabs-overview'
import AccountsDetailTabsContacts from '#/components/accounts/accounts-detail-tabs-contacts'
import AccountsDetailTabsCampaigns from '#/components/accounts/accounts-detail-tabs-campaigns'
import AccountsDetailTabsActivity from '#/components/accounts/accounts-detail-tabs-activity'
import AccountsDetailTabsProduct from '#/components/accounts/accounts-detail-tabs-product'
import AccountsDetailTabsNotes from '#/components/accounts/accounts-detail-tabs-notes'
import AccountsDetailTabsTickets from '#/components/accounts/accounts-detail-tabs-tickets'
import AccountsDetailTabsTasks from '#/components/accounts/accounts-detail-tabs-tasks'

export default {
  name: 'AccountsDetailTabs',

  components: {
    AccountsDetailTabsActivity,
    AccountsDetailTabsCampaigns,
    AccountsDetailTabsContacts,
    AccountsDetailTabsNotes,
    AccountsDetailTabsOverview,
    AccountsDetailTabsProduct,
    AccountsDetailTabsTasks,
    AccountsDetailTabsTickets,
    MisoTabPane,
    MisoTabs
  },

  props: {
    onShowSidePanel: {
      type: Function,
      default () {}
    },
    reviewMode: {
      type: Boolean,
      default: false
    },
    campaignTableData: {
      type: Array,
      default: () => [{
        status: null,
        name: null,
        id: null
      }]
    }
  },

  computed: {
    ...mapGetters([
      'isJustworks',
      'activeTab'
    ]),

    ifOverflow () {
      switch (this.activeTab) {
        case 'overview':
        case 'notes':
        case 'activity':
          return ''
        default:
          return 'overflow-y-auto'
      }
    }
  },

  methods: {
    ...mapActions(['changeTab']),

    onTabClick (tab) {
      this.changeTab(tab.name)
    }
  }
}
</script>
