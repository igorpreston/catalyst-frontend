<template>
  <div class="pt24 f6">
    <div class="flex flex-auto justify-between">
      <div class="flex flex-auto">
        <miso-date-picker
          :picker-options="pickerOptions"
          v-model="dateRange"
          class="mr2"
          type="daterange"
          format="MM/dd/yyyy"
          placeholder="e.g 11/16/2017 – 11/17/2017"
          range-separator=" - "/>

        <miso-select
          v-model="rangeFormat"
          :disabled="!availableRangeFormats.length">
          <miso-option
            v-for="format in availableRangeFormats"
            :value="format.value"
            :key="format.value"
            :label="format.label"/>
        </miso-select>
      </div>

      <div
        v-if="currentChart && triggerChartLoading"
        class="flex flex-auto items-center justify-end">
        <span class="mr2 f8 all-time-average">&#9679;</span>
        <span class="mr3">
          All-time Average:
          <span class="fw5">
            {{ currentChart.meta.all_time_avg }}<span v-if="isPercantage">%</span>
          </span>
        </span>

        <span class="mr2 f8 time-period-average">&#9679;</span>
        <span>
          Time-period Average:
          <span class="fw5">
            {{ currentChart.meta.time_period_avg }}<span v-if="isPercantage">%</span>
          </span>
        </span>
      </div>
    </div>

    <product-chart-module
      v-loading="loading"
      :height="125"
      :trigger-chart-loading="triggerChartLoading"
      class="pv24 bb b--light-gray"/>
  </div>
</template>

<script>
import moment from 'moment-timezone'

import {
  MisoDatePicker,
  MisoSelect,
  MisoOption
} from 'miso'

import _ from 'lodash'

import { mapState, mapMutations, mapGetters } from 'vuex'

import ProductChartModule from '#/components/product/product-chart-module'

export default {
  name: 'ProductChart',

  components: {
    MisoDatePicker,
    MisoSelect,
    MisoOption,
    ProductChartModule
  },

  data () {
    return {
      loading: false,
      dateRangeArray: null,
      pickerOptions: {
        disabledDate (date) {
          const today = new Date()
          return date > today
        },
        shortcuts: [
          {
            text: 'Today',
            onClick: (picker) => {
              const today = moment.tz((this.currentUser && this.currentUser.time_zone) || 'UTC')
              const yesterday = moment.tz(today, (this.currentUser && this.currentUser.time_zone) || 'UTC').subtract(1, 'days')
              picker.$emit('pick', [yesterday, today])
            }
          },
          {
            text: '7 Days',
            onClick: (picker) => {
              const end = moment.tz((this.currentUser && this.currentUser.time_zone) || 'UTC')
              const start = moment.tz(end, (this.currentUser && this.currentUser.time_zone) || 'UTC').subtract(7, 'days')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '30 Days',
            onClick: (picker) => {
              const end = moment.tz((this.currentUser && this.currentUser.time_zone) || 'UTC')
              const start = moment.tz(end, (this.currentUser && this.currentUser.time_zone) || 'UTC').subtract(30, 'days')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Month-To-Date',
            onClick: (picker) => {
              const end = moment.tz((this.currentUser && this.currentUser.time_zone) || 'UTC')
              const start = moment.tz(end, (this.currentUser && this.currentUser.time_zone) || 'UTC').startOf('month')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Quarter-To-Date',
            onClick: (picker) => {
              const end = moment.tz((this.currentUser && this.currentUser.time_zone) || 'UTC')
              const start = moment.tz(end, (this.currentUser && this.currentUser.time_zone) || 'UTC').startOf('quarter')
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: 'Year-To-Date',
            onClick: (picker) => {
              const end = moment.tz((this.currentUser && this.currentUser.time_zone) || 'UTC')
              const start = moment.tz(end, (this.currentUser && this.currentUser.time_zone) || 'UTC').startOf('year')
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },

  computed: {

    ...mapState({
      options: state => state.metrics.options,
      currentUser: state => state.auth.currentUser
    }),

    ...mapGetters([
      'currentMetric', 'currentChart'
    ]),

    dateRange: {
      get () {
        if (this.options.dateRange) {
          return this.options.dateRange
        }

        const today = moment.tz((this.currentUser && this.currentUser.time_zone) || 'UTC')
        const from = moment.tz((this.currentUser && this.currentUser.time_zone) || 'UTC').subtract(this.currentMetric.days_count, 'days')
        const value = [ from, today ]
        this.setOption({ index: 'dateRange', value })

        return value
      },

      set (value) {
        this.setOption({ index: 'dateRange', value })
        this.resetPeriod()
      }
    },

    rangeFormat: {
      get () {
        if (this.options.period) {
          return this.options.period
        }

        return this.resetPeriod()
      },

      set (value) {
        this.setOption({ index: 'period', value })
      }
    },

    availableRangeFormats () {
      const startRange = moment(this.dateRange[0])
      const endRange = moment(this.dateRange[1])
      let range = endRange.diff(startRange, 'days')

      if (range >= 0 && range <= 7) {
        return [{ value: 'day', label: 'Daily' }]
      } else if (range >= 8 && range <= 30) {
        return [{ value: 'day', label: 'Daily' }, { value: 'week', label: 'Weekly' }]
      } else if (range > 30 && range < 90) {
        return [{ value: 'week', label: 'Weekly' }, { value: 'month', label: 'Monthly' }]
      } else if (range > 90 && range < 360) {
        return [{ value: 'month', label: 'Monthly' }]
      } else {
        return [{ value: 'year', label: 'Yearly' }]
      }
    },

    isPercantage () {
      return this.currentMetric && this.currentMetric.default_formula === 'percentage_of_users_performing_events'
    }
  },

  methods: {
    ...mapMutations(['setOption']),

    resetPeriod () {
      const currentPeriod = this.options.period

      if (_.find(this.availableRangeFormats, { value: currentPeriod })) {
        return
      }

      const rangeFormat = this.availableRangeFormats &&
          this.availableRangeFormats[0] &&
          this.availableRangeFormats[0].value

      this.setOption({ index: 'period', value: rangeFormat })
      return rangeFormat
    },

    triggerChartLoading (loading) {
      this.loading = loading
    }
  }
}
</script>

<style lang="scss">
  .all-time-average {
    color: #63D3F8;
  }

  .time-period-average {
    color: #4661FF;
  }

  .el-picker-panel [slot=sidebar],
  .el-picker-panel__sidebar {
    width: 125px;
  }

  .el-picker-panel [slot=sidebar] + .el-picker-panel__body,
  .el-picker-panel__sidebar + .el-picker-panel__body {
    margin-left: 125px;
  }

  .el-date-range-picker.has-sidebar {
    min-width: 640px;
  }

  .el-select .el-input__inner:focus {
    border-color: #6957da;
  }

  .el-picker-panel .el-date-table td.disabled,
  .el-picker-panel .el-date-table td.disabled.in-range {
    background-color: #f4f4f4 !important;
  }
</style>
