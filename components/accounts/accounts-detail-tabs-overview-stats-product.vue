<template>
  <div
    v-loading="isLoadingMetrics"
    class="mb24">
    <div
      v-if="metrics.all.length"
      class="flex overflow-x-auto">
      <div
        v-for="(metric, index) in metrics.all"
        :key="metric.id"
        class="pa3 tc br2 pointer metrics__item"
        @click="onMetricClick(index)">
        <p class="mt0 mb3 f6">
          {{ metric.name }}
        </p>

        <p class="mt0 mb2 fw8">
          {{ metric.options.total }}
        </p>

        <p
          :class="percentageRowClass(metric.options.percentage)"
          class="flex flex-auto flex-wrap justify-center mt0 mb12 f6 metrics__percentage">
          <feather-icon
            v-if="metric.options.percentage != 0"
            :name="metric.options.percentage > 0 ? 'arrow-up' : 'arrow-down'"
            :color="percentageRowClass(metric.options.percentage)"
            :key="metric.id"
            width="16"
            height="16"
            class="mr1" />

          <span class="mh1 fw8">{{ transformPercentage(metric.options.percentage) }}%</span>
          compared to
          <span class="ml1 fw8">yesterday</span>
        </p>

        <p class="separator" />

        <p class="mh0 mt0 mb1 description">
          {{ metric.options.humanized_formula }}
        </p>

        <p class="ma0 description">
          Measured over {{ metric.days_count }} day{{ metric.days_count > 1 ? 's' : '' }}
        </p>
      </div>
    </div>

    <miso-empty
      v-else
      class="ba b--light-gray br2 pa24 stats--empty"
      heading="No Success Metrics"
      body="You haven't created any metrics yet.">
      <div class="flex justify-center">
        <span
          class="mb2 br-100 ba b--light-gray bg-off-white stats--empty__icon">
          <feather-icon
            :stroke-width="1.5"
            width="18"
            height="18"
            name="trending-up"
            color="mid-gray" />
        </span>
      </div>
    </miso-empty>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import {
  FeatherIcon,
  MisoHeading,
  MisoEmpty
} from 'miso'

export default {
  name: 'AccountsDetailTabsOverviewStatsProduct',

  components: {
    FeatherIcon,
    MisoHeading,
    MisoEmpty
  },

  computed: {
    ...mapState({
      account: state => state.accounts.account,
      metrics: state => state.metrics,
      isLoadingMetrics: state => state.metrics.isLoadingMetrics,
      task: state => state.tasks.task
    }),

    reviewAccountId () {
      if (this.task) {
        return this.task.account_id
      } else {
        return this.account && this.account.id
      }
    }
  },

  watch: {
    account: function (newAccount, oldAccount) {
      if (newAccount && this.reviewAccountId) {
        this.fetchMetricsByAccount(this.reviewAccountId)
      }
    }
  },

  methods: {
    ...mapActions(['changeTab', 'fetchMetricsByAccount']),

    ...mapMutations(['setMetricIndex']),

    transformPercentage (value) {
      let newValue = Math.abs(value)
      return Math.round(newValue)
    },

    toggleShow () {
      this.showMore = !this.showMore
      this.handleBlockHide()
    },

    onMetricClick (index) {
      this.setMetricIndex(index)
      this.changeTab('product')
    },

    percentageRowClass (percentage) {
      if (percentage > 0) {
        return 'green-metrics'
      } else if (percentage < 0) {
        return 'red-metrics'
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .mb12 {
    margin-bottom: 12px;
  }

  .metrics {
    &__item {
      min-width: 233px;
      border: 1px solid #EDEDFB;

      &:not(:last-child) {
        margin-right: 16px;
      }

      &.active {
        background-color: #FBFBFE;
      }
    }

    &__show {
      width: 88px;
      padding: 0;
      font-size: 13px;
    }
  }

  .separator {
    width: 20px;
    height: 1px;
    margin: 1rem auto;
    background-color: #CACACF;
  }

  .description {
    color: #9C9CA6;
    font-size: 13px;
  }
</style>
