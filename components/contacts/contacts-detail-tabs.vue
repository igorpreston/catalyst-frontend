<template>
  <div class="flex flex-auto bg-white ba b--purple-gray overflow-hidden flex-1 contacts__tabs">
    <miso-tabs
      :class="ifOverflow"
      :value="activeTab"
      class="flex-auto"
      @tab-click="onTabClick">

      <miso-tab-pane
        name="overview"
        label="Overview">
        <contacts-detail-tabs-overview/>
      </miso-tab-pane>

      <!--  TODO: Campaigns will be pulled back after beta -->
      <!-- <miso-tab-pane name="campaigns" label="Campaigns">
        <contacts-detail-tabs-campaigns></contacts-detail-tabs-campaigns>
      </miso-tab-pane> -->

      <miso-tab-pane
        name="activity"
        label="Activity Timeline">
        <contacts-detail-tabs-activity :is-active="activeTab === 'activity'"/>
      </miso-tab-pane>

      <miso-tab-pane
        name="product"
        label="Product Usage">
        <contacts-detail-tabs-product/>
      </miso-tab-pane>

      <miso-tab-pane
        name="notes"
        label="Notes">
        <contacts-detail-tabs-notes
          :on-show-side-panel="onShowSidePanel"
        />
      </miso-tab-pane>

      <miso-tab-pane
        v-if="isJustworks"
        name="tickets"
        label="Tickets">
        <contacts-detail-tabs-tickets/>
      </miso-tab-pane>

      <miso-tab-pane
        name="tasks"
        label="Tasks">
        <contacts-detail-tabs-tasks
          :review-mode="reviewMode"
          :on-show-side-panel="onShowSidePanel"/>
      </miso-tab-pane>

    </miso-tabs>

  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  FeatherIcon,
  MisoTabPane,
  MisoTabs
} from 'miso'

import ContactsDetailTabsOverview from '#/components/contacts/contacts-detail-tabs-overview'
import ContactsDetailTabsCampaigns from '#/components/contacts/contacts-detail-tabs-campaigns'
import ContactsDetailTabsActivity from '#/components/contacts/contacts-detail-tabs-activity'
import ContactsDetailTabsProduct from '#/components/contacts/contacts-detail-tabs-product'
import ContactsDetailTabsNotes from '#/components/contacts/contacts-detail-tabs-notes'
import ContactsDetailTabsTickets from '#/components/contacts/contacts-detail-tabs-tickets'
import ContactsDetailTabsTasks from '#/components/contacts/contacts-detail-tabs-tasks'

export default {
  name: 'ContactsDetailTabs',

  components: {
    ContactsDetailTabsActivity,
    ContactsDetailTabsCampaigns,
    ContactsDetailTabsNotes,
    ContactsDetailTabsOverview,
    ContactsDetailTabsProduct,
    ContactsDetailTabsTasks,
    ContactsDetailTabsTickets,
    FeatherIcon,
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
    ...mapActions([
      'changeTab'
    ]),

    onTabClick (tab) {
      this.changeTab(tab.name)
    }
  }
}
</script>
