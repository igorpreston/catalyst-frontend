<template>
  <div class="flex flex-auto flex-column mt4 relative">
    <div class="flex flex-auto items-center justify-between f6">
      <p class="ma0 pr24">
        Showing a <span class="b">{{ huminizedPeriod }}</span> count from <span class="b">{{ huminizedDateRange[0] }}</span> to <span class="b">{{ huminizedDateRange[1] }}</span>
      </p>

      <el-popover
        ref="comparePopover"
        placement="bottom-end"
        width="173">
        <div class="pa3 metric__compare checkbox--vertical">
          <miso-checkbox-group
            v-model="selectedMetrics">
            <miso-checkbox
              v-for="metric in metrics"
              :label="metric.id"
              :disabled="currentMetric.id === metric.id"
              :key="metric.id">
              {{ metric.name }}
            </miso-checkbox>
          </miso-checkbox-group>
        </div>
      </el-popover>

      <miso-button
        v-popover:comparePopover
        type="outline"
        class="self-end">
        <div class="flex">
          Compare
          <feather-icon
            width="16"
            height="16"
            color="purple"
            name="chevron-down"
            class="ml2"/>
        </div>
      </miso-button>
    </div>

    <div class="flex flex-auto mt3 nowrap">
      <miso-table
        v-loading="isComparingTableLoading"
        :data="compareTableData"
        row-key="id">
        <miso-table-column
          label="Success metric"
          width="164">
          <template slot-scope="scope">
            <div
              :class="{ 'not-active' : currentMetric.name !== scope.row.name }"
              class="break-word">
              {{ scope.row.name }}
            </div>
          </template>
        </miso-table-column>

        <miso-table-column
          v-for="item in compareTableColumns"
          :label="item.label"
          :key="item.label"
          :prop="item.prop"
          min-width="130">
          <template slot-scope="scope">
            <div :class="{ 'not-active' : currentMetric.name !== scope.row.name }">
              {{ scope.row[item.prop] }}
            </div>
          </template>
        </miso-table-column>
      </miso-table>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
import moment from 'moment-timezone'

import { Tooltip, Popover } from 'element-ui'

import {
  MisoButton,
  MisoCheckbox,
  MisoCheckboxGroup,
  MisoTable,
  MisoTableColumn,
  FeatherIcon
} from 'miso'

export default {
  name: 'ProductCompareMetric',

  components: {
    'el-tooltip': Tooltip,
    'el-popover': Popover,
    MisoButton,
    MisoCheckbox,
    MisoCheckboxGroup,
    MisoTable,
    MisoTableColumn,
    FeatherIcon
  },

  data () {
    return {
      selectedMetricsData: [],
      isComparingTableLoading: false,
      refresh: false,

      selectedItems: []
      // labels for columns should be dynamic I think. 'months.0' stays for 0-index element in months array
    }
  },

  computed: {
    ...mapState({
      metrics: state => state.metrics.all,
      charts: state => state.metrics.charts,
      options: state => state.metrics.options,
      currentUser: state => state.auth.currentUser,
      account: state => state.accounts.account,
      contact: state => state.contacts.contact
    }),

    ...mapGetters(['currentMetric', 'currentChart']),

    // Concat the current metric with the selected metrics together, so that
    // we can fetch all the metric data.
    selectedMetrics: {
      get () {
        if (!_.includes(this.selectedMetricsData, this.currentMetric.id)) {
          return _.concat([this.currentMetric.id], this.selectedMetricsData)
        }

        return this.selectedMetricsData
      },

      set (value) {
        this.selectedMetricsData = value
      }
    },

    compareTableColumns () {
      return Object.keys(this.currentChart.data).map(
        date => {
          let format = null

          switch (this.options.period) {
            case 'year':
              format = 'YYYY'
              break
            default:
              format = 'MM/DD'
              break
          }

          return {
            label: moment.tz(date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format(format),
            prop: date
          }
        }
      )
    },

    compareTableData () {
      const result = [...this.selectedMetrics].map(
        metricId => {
          const metric = _.find(this.metrics, { id: metricId })

          if (!this.charts[metricId]) {
            return {}
          }

          return {
            ...Object.entries({ ...this.charts[metricId].data }).reduce((prev, curr) => {
              let huminizedEntityName = ''

              switch (metric.default_formula) {
                case 'total_number_of_events':
                  huminizedEntityName = 'events'
                  break
                case 'ratio_of_events_per_user':
                  huminizedEntityName = 'events / user'
                  break
                case 'percentage_of_users_performing_events':
                  huminizedEntityName = '% of users'
                  break
                case 'total_number_of_users_performing_events':
                  huminizedEntityName = 'users'
                  break
              }

              prev[curr[0]] = curr[1].toString() + ' ' + huminizedEntityName
              return prev
            }, {}),
            name: metric.name
          }
        }
      )

      if (_.compact(result).length !== this.selectedMetrics.length || this.isComparingTableLoading) {
        return []
      }

      return result
    },

    currentMetricChangeObject () {
      return {
        ...this.currentMetric,
        ...this.options
      }
    },

    huminizedPeriod () {
      return this.options.period === 'day' ? 'daily' : this.options && this.options.period + 'ly'
    },

    huminizedDateRange () {
      return this.options.dateRange && this.options.dateRange.map(date => {
        return moment.tz(date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format('MM/DD/YYYY')
      })
    }
  },
  watch: {
    // When the current metric changes
    currentMetricChangeObject: function () {
      this.selectedMetricsData = []
      this.refresh = true
    },
    // When the selected metrics used to compare with current metrics changes
    selectedMetrics: function (newMetrics, oldMetrics) {
      if (oldMetrics.length < newMetrics.length) {
        const metricId = _.first(_.difference(newMetrics, oldMetrics))

        // Fetch new data only when the data is not in charts or the current
        // metric gets changed.
        if (!this.charts[metricId] || this.refresh) {
          const metric = _.find(this.metrics, { id: metricId })
          if (this.contact && this.contact.id) {
            this.isComparingTableLoading = true
            return this.fetchChartByContact({
              metric: metric,
              id: this.contact.id
            })
              .then(() => {
                this.isComparingTableLoading = false
              })
              .catch(() => {
                this.isComparingTableLoading = false
              })
          } else if (this.account && this.account.id) {
            this.isComparingTableLoading = true
            return this.fetchChartByAccount({
              metric: metric,
              id: this.account.id
            })
              .then(() => {
                this.isComparingTableLoading = false
              })
              .catch(() => {
                this.isComparingTableLoading = false
              })
          }
        }
      }
      this.refresh = false
    }
  },

  methods: {
    ...mapActions(['fetchChartByContact', 'fetchChartByAccount'])
  }
}
</script>

<style lang="scss">
  .metric__compare {
    & + .popper__arrow {
      display: none;
    }

    .el-checkbox {
      display: flex;
      word-break: break-all;
    }

    .el-checkbox__label {
      white-space: initial;
    }
  }
  .not-active {
    color: #7E7F89;
  }
  .break-word {
    word-break: break-all;
  }
</style>
