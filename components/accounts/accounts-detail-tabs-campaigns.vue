<template>
  <miso-table
    ref="campaignTable"
    :data="campaignTableData"
    row-key="id">
    <miso-table-column
      label="Status"
      width="120"
      align="center">
      <template slot-scope="scope">
        <miso-status-indicator
          :status="scope.row.active"
          :width="80"
          :height="30"
          class="mr3"
          true-label="Active"
          false-label="Paused"/>
      </template>
    </miso-table-column>
    <miso-table-column
      label="Name"
      prop="name"
      sortable>
      <template slot-scope="scope">
        <a
          :href="campaignUrl(scope.row.id)"
          class="link">
          {{ scope.row.name }}
        </a>
      </template>
    </miso-table-column>
    <miso-table-column
      label="Statistics"
      prop="stats"/>
  </miso-table>
</template>

<script>
import { mapState, mapActions } from 'vuex'

import {
  MisoTable,
  MisoTableColumn,
  MisoStatusIndicator
} from 'miso'

export default {
  name: 'AccountsDetailTabsCampaigns',

  components: {
    MisoTable,
    MisoTableColumn,
    MisoStatusIndicator
  },

  props: {
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
    ...mapState({
      account: state => state.accounts.account
    })
  },

  watch: {
    account: function () {
      if (this.account) {
        this.fetchCampaignsByAccount(this.account.id)
      }
    }
  },

  methods: {
    ...mapActions(['fetchCampaignsByAccount']),

    campaignUrl (id) {
      return `/campaigns/${id}`
    }
  }
}
</script>
