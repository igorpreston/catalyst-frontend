<template>
  <miso-table
    :data="metrics"
    class="full-height-table--inner"
    @selection-change="selectMetrics">
    <div slot="empty">
      <miso-empty
        class="pv5"
        heading="No Success Metrics"
        body="You're good to go!"/>
    </div>

    <miso-table-column type="selection"/>

    <miso-table-column
      prop="name"
      label="Name"
      min-width="160"
      sortable/>

    <miso-table-column
      prop="default_formula"
      label="Default Formula"
      min-width="250"
      sortable>
      <template slot-scope="scope">
        {{ formulaHumanized(scope.row.default_formula) }}
      </template>
    </miso-table-column>

    <miso-table-column
      label="Default Timeframe"
      prop="days_count"
      min-width="250"
      sortable>
      <template slot-scope="scope">
        Measured over
        {{ scope.row.days_count }} day{{ scope.row.days_count > 1 ? 's' : '' }}
      </template>
    </miso-table-column>

    <miso-table-column
      prop="created_at"
      label="Created"
      min-width="120"
      sortable>
      <template slot-scope="scope">
        {{ dateFormat(scope.row.created_at) }}
      </template>
    </miso-table-column>
  </miso-table>
</template>

<script>
import {
  MisoTable,
  MisoTableColumn,
  MisoEmpty
} from 'miso'

import moment from 'moment-timezone'

import { mapState, mapActions } from 'vuex'

export default {
  name: 'SettingsSuccessMetricsTableBody',

  components: {
    MisoTable,
    MisoTableColumn,
    MisoEmpty
  },

  props: {
    destination: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      formulas: {
        'total_number_of_events': 'Total # of events',
        'percentage_of_users_performing_events': 'Percentage of users performing events',
        'ratio_of_events_per_user': 'Ratio of events per user',
        'total_number_of_users_performing_events': 'Total # of users performing event'
      }
    }
  },

  computed: {
    ...mapState({
      metrics: state => state.metrics.all,
      currentUser: state => state.auth.currentUser
    })
  },

  methods: {
    ...mapActions(['selectMetrics']),

    dateFormat (date) {
      return moment.tz(date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('YYYY/DD/MM')
    },

    formulaHumanized (formula) {
      return this.formulas[formula]
    }
  }
}
</script>
