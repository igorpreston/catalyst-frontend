<template>
  <div class="flex flex-auto overflow-x-auto">
    <div class="flex metrics">
      <div
        v-for="(metric, index) in metrics"
        :key="metric.id"
        class="pa3 tc br2 pointer metrics__item"
        :class="{ 'active' : currentMetric.id === metric.id }"
        @click="setMetricIndex(index)"
        v-loading="loadingMetric === metric.id">
        <p class="mt0 mb3 f6">
          {{ metric.name }}
        </p>

        <p class="mt0 mb2 fw8 flex flex-auto justify-center">
          {{ metric.options.total }}
          <!-- put desired tooltip text in `content` -->
          <el-tooltip
            v-if="metric.default_formula === 'percentage_of_users_performing_events'"
            :content="percentageTooltip(metric)"
            placement="top">
            <feather-icon
              name="help-circle"
              width="15"
              height="15"
              color="mid-gray"
              class="ml2">
            </feather-icon>
          </el-tooltip>
        </p>

        <p class="flex flex-auto flex-wrap justify-center mt0 mb12 f6">
          <feather-icon
            :name="metric.options.percentage > 0 ? 'arrow-up' : 'arrow-down'"
            :color="metric.options.percentage > 0 ? 'green' : 'red'"
            v-if="metric.options.percentage !== 0"
            :key="metric.id"
            width="16"
            height="16"
            class="mr1">
          </feather-icon>

          <span class="mh1 fw8">{{ transformPercentage(metric.options.percentage) }}%</span>
          compared to
          <span class="ml1 fw8">yesterday</span>
        </p>

        <p class="separator"></p>

        <p class="mh0 mt0 mb1 description">
          {{ metric.options.humanized_formula }}
        </p>

        <p class="ma0 description">
          Measured over {{ metric.days_count }} day{{ metric.days_count > 1 ? 's' : '' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { FeatherIcon } from 'miso'
  import { Tooltip } from 'element-ui'
  import { mapMutations, mapState, mapGetters } from 'vuex'

  export default {
    name: 'product-select-metric',

    props: {
      loadingMetric: {
        type: String,
        default: null
      }
    },

    components: {
      FeatherIcon,
      'el-tooltip': Tooltip
    },

    computed: {
      ...mapState({
        metrics: state => state.metrics.all
      }),
      ...mapGetters(['currentMetric'])
    },

    methods: {
      ...mapMutations(['setMetricIndex']),

      transformPercentage (value) {
        const newValue = Math.abs(value)
        return Math.round(newValue)
      },

      percentageTooltip (metric) {
        let total_users_count = metric.options.total_users_count
        let users_count = metric.options.users_count

        return `${users_count} out you ${total_users_count} active users have performed this event`
      }
    }
  }
</script>

<style scoped lang="scss">
  .mb12 {
    margin-bottom: 12px;
  }

  .metrics {
    flex: 0 0 auto;

    &__item {
      width: 280px;
      border: 1px solid #EDEDFB;

      &:not(:last-child) {
        margin-right: 16px;
      }

      &.active {
        background-color: #FBFBFE;
      }
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
