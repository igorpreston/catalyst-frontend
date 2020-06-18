<script>
import { Line } from 'vue-chartjs'
import { mapState, mapActions, mapGetters } from 'vuex'
import moment from 'moment-timezone'
import _ from 'lodash'

export default {
  name: 'ProductChartModule',

  extends: Line,

  props: {
    triggerChartLoading: {
      type: Function,
      default () {}
    }
  },

  data () {
    return {
      chartOptions: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: false,
          mode: 'point',
          intersect: 'true',
          position: 'nearest',
          yAlign: 'bottom',
          yPadding: 12,
          xPadding: 13,
          bodyFontSize: 14,
          custom: (tooltip) => {
            let tooltipEl = document.getElementById('chartjs-tooltip')
            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip'
              tooltipEl.innerHTML = '<div></div>'
              this.$data._chart.canvas.parentNode.appendChild(tooltipEl)
            }

            if (tooltip.opacity === 0) {
              tooltipEl.style.opacity = 0
              return
            }

            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if (tooltip.yAlign) {
              tooltipEl.classList.add(tooltip.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }

            let bodyLines = tooltip.body.map(bodyItem => bodyItem.lines) || []

            if (tooltip.body) {
              let innerHtml = '<div></div>'
              let entityName = this.currentMetric.default_formula === 'ratio_of_events_per_user' ? 'events / user' : this.currentMetric.options.total.split(' ').pop()
              const percentage = this.currentMetric.default_formula === 'percentage_of_users_performing_events' ? '%' : ''

              innerHtml += `<span class="fw8">${bodyLines[bodyLines.length - 1]}${percentage} of ${entityName instanceof Array ? entityName.join(' ') : entityName}</span><span> in the last </span><span class="fw8">${this.currentMetric.days_count} days since ${tooltip.title[tooltip.title.length - 1]} </span>`
              innerHtml += '</div>'
              let tableRoot = tooltipEl.querySelector('div')
              tableRoot.innerHTML = innerHtml
            }
            const positionY = this.$data._chart.canvas.offsetTop
            const positionX = this.$data._chart.canvas.offsetLeft

            if (!tooltip.body) {
              tooltipEl.style.display = 'none'
              return
            }
            tooltipEl.style.display = 'block'
            tooltipEl.style.transform = 'translate(17px, 0)'
            tooltipEl.style.opacity = 1
            tooltipEl.style.left = positionX + tooltip.caretX + 'px'
            if (window.innerWidth < tooltip.caretX + 326) {
              tooltipEl.style.left = tooltip.caretX - 226 - positionX + 'px'
            }
            tooltipEl.style.top = positionY + tooltip.caretY + 'px'
            tooltipEl.style.width = 226 + 'px'
            tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px'
            tooltipEl.style.fontStyle = tooltip._bodyFontStyle
            tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px'
          },
          filter: function (tooltipItem) {
            return tooltipItem.datasetIndex === 0
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: true
            }
          }],
          yAxes: [{
            gridLines: {
              display: true
            }
          }]
        }
      }
    }
  },

  computed: {
    ...mapState({
      options: state => state.metrics.options,
      charts: state => state.metrics.charts,
      currentUser: state => state.auth.currentUser,
      account: state => state.accounts.account,
      contact: state => state.contacts.contact
    }),

    ...mapGetters(['currentChart', 'currentMetric']),

    currentMetricChangeObject () {
      return {
        ...this.currentMetric,
        ...this.options
      }
    }
  },

  watch: {
    currentMetricChangeObject: function (prev, curr) {
      const keys = _.union(_.keys(prev), _.keys(curr))

      const changed = _.filter(keys, (key) => {
        return prev[key] !== curr[key]
      })

      if (changed.length === 1 && (changed[0] === 'default_formula' || changed[0] === 'days_count')) {
        return
      }

      this.refetch()
    }
  },

  mounted () {
    this.refetch()
  },

  methods: {
    ...mapActions(['fetchChartByAccount', 'fetchChartByContact']),

    prepareXs (chart) {
      return Object.keys(chart.data).map((date) => {
        let format = null

        switch (this.options.period) {
          case 'year':
            format = 'YYYY'
            break
          default:
            format = 'MM/DD'
            break
        }

        return format ? moment.tz(date, (this.currentUser && this.currentUser.time_zone) || 'UTC').format(format) : date
      })
    },

    prepareYs (chart) {
      return Object.values(chart.data)
    },

    prepareAllTimeAverage (chart) {
      const length = Object.values(chart.data).length
      return _.fill(Array(length), chart.meta.all_time_avg)
    },

    prepareTimeAverage (chart) {
      const length = Object.values(chart.data).length
      return _.fill(Array(length), chart.meta.time_period_avg)
    },

    refetch () {
      if (this.contact && this.contact.id) {
        this.triggerChartLoading(true)
        return this.fetchChartByContact({
          metric: this.currentMetric,
          id: this.contact.id
        })
          .then(() => {
            this.redrawChart()
            this.triggerChartLoading(false)
          })
          .catch(() => {
            this.triggerChartLoading(false)
          })
      } else if (this.account && this.account.id) {
        this.triggerChartLoading(true)
        return this.fetchChartByAccount({
          metric: this.currentMetric,
          id: this.account.id
        })
          .then(() => {
            this.redrawChart()
            this.triggerChartLoading(false)
          })
          .catch(() => {
            this.triggerChartLoading(false)
          })
      }
    },

    redrawChart () {
      const data = {
        labels: this.prepareXs(this.currentChart),
        datasets: [
          {
            borderColor: '#8779E1',
            pointBorderColor: '#5B65DD',
            pointBackgroundColor: '#ffffff',
            pointHoverBackgroundColor: '#5B65DD',
            pointHoverBorderColor: '#5B65DD',
            pointBorderWidth: 2,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
            fill: true,
            backgroundColor: 'linear-gradient(to bottom, rgba(204,208,245,1), rgba(255,255,255,0))',
            borderWidth: 2,
            tension: 0,
            data: this.prepareYs(this.currentChart)
          },
          {
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            hoverRadius: 0,
            borderColor: '#63D3F8',
            borderWidth: 1,
            borderDash: [5, 2],
            data: this.prepareAllTimeAverage(this.currentChart)
          },
          {
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0,
            hoverRadius: 0,
            borderColor: '#4661FF',
            borderWidth: 1,
            borderDash: [5, 2],
            data: this.prepareTimeAverage(this.currentChart)
          }
        ]
      }

      if (this.$data._chart) {
        this.$data._chart.destroy()
      }

      this.renderChart(data, this.chartOptions)
    }
  }
}
</script>

<style>
  #chartjs-tooltip {
    position: absolute;
    border-radius: 0;
    background: #fff;
    color: #404046;
    -webkit-transition: all .1s ease;
    transition: all .1s ease;
    pointer-events: none;
    opacity: 1;
    box-shadow: 2px 2px 8px 0 rgba(0, 0, 0, 0.2);
  }

  .chartjs-tooltip-key {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 10px;
  }
</style>
