<template>
  <div
    v-loading="isLoadingMetrics"
    class="flex flex-auto pa3 pb24">
    <div
      v-if="metrics.all.length"
      class="flex flex-auto flex-column">
      <product-header
        :toggle-loading="toggleLoading"/>

      <product-select-metric
        :loading-metric="loadingMetricId"/>

      <product-chart/>

      <product-compare-metric
        v-if="currentChart"/>
    </div>

    <div
      v-else-if="!metrics.all.length"
      class="flex flex-auto items-center justify-center">
      <p class="f4 mid-gray">No Metrics</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'

import ProductHeader from '#/components/product/product-header'
import ProductSelectMetric from '#/components/product/product-select-metric'
import ProductChart from '#/components/product/product-chart'
import ProductCompareMetric from '#/components/product/product-compare-metric'

export default {
  name: 'ProductIndex',

  components: {
    ProductHeader,
    ProductSelectMetric,
    ProductChart,
    ProductCompareMetric
  },

  data () {
    return {
      currentMetricIndex: 0,
      loadingMetricId: ''
    }
  },

  computed: {
    ...mapState({
      metrics: state => state.metrics,
      isLoadingMetrics: state => state.metrics.isLoadingMetrics
    }),

    ...mapGetters([
      'isFirstMetric', 'isLastMetric', 'currentChart'
    ])
  },

  watch: {
    currentMetricIndex: function () {
      this.setOption({ index: 'dateRange', value: null })
    }
  },

  methods: {
    ...mapMutations(['setOption']),

    toggleLoading (id) {
      this.loadingMetricId = id
    }
  }
}
</script>
