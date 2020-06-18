<template lang="html">
  <miso-table
    :data="accounts"
    height="100%"
    class="vh-100"
    borderless>
    <div slot="empty">
      <miso-empty
        class="pv5"
        heading="No Accounts"
        body="You're good to go!"/>
    </div>

    <miso-table-column
      type="selection"
      width="55"/>

    <miso-table-column
      prop="name"
      label="Account"
      sortable
      min-width="130"/>

    <miso-table-column
      label="Description"
      prop="description"
      min-width="400">
      <template slot-scope="scope">
        <div class="truncate">
          {{ scope.row.description }}
        </div>
      </template>
    </miso-table-column>

    <miso-table-column
      label="Value"
      min-width="150"
      prop="contract_value"
      sortable>
      <template slot-scope="scope">
        $
        {{ scope.row.decimal_contract_value }}
      </template>
    </miso-table-column>

    <miso-table-column
      label="Stage"
      min-width="150"
      prop="stage"
      sortable/>

    <miso-table-column
      label="Renewal"
      min-width="150"
      sortable>
      <template slot-scope="scope">
        {{ formattedRenewalDate(scope.row.renewal_date) }}
      </template>
    </miso-table-column>

    <miso-table-column
      label="Last Activity"
      min-width="170"
      sortable>
      <template slot-scope="scope">
        {{ formattedRenewalDate(scope.row.updated_at) }}
      </template>
    </miso-table-column>
  </miso-table>
</template>

<script>
import moment from 'moment-timezone'
import { mapState } from 'vuex'

import {
  MisoEmpty,
  MisoTable,
  MisoTableColumn
} from 'miso'

export default {
  name: 'SegmentsDetailTableAccounts',

  components: {
    MisoEmpty,
    MisoTable,
    MisoTableColumn
  },

  props: {
    accounts: {
      type: Array,
      default: () => []
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser
    })
  },

  methods: {
    formattedRenewalDate (date) {
      if (!date) return
      return moment.tz(date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
    }
  }
}
</script>
