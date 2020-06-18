<template>
  <div class="flex flex-auto pv3 justify-between items-center">
    <p
      v-if="anyMetricsSelected"
      class="mv0 f6 truncate">
      {{ selectedMetricsNum }}
      {{ selectedMetricsNum === 1 ? 'metric' : 'metrics' }}
      selected
    </p>

    <p
      v-else
      class="mv0 f6 truncate">
      Showing
      {{ metricsNum }}
      out of
      {{ metricsNum }}
      metrics. These metrics track the success of product engagement and usage.
    </p>

    <div class="flex items-center">
      <div
        v-if="anyMetricsSelected"
        class="br b--light-gray pr3 flex items-center mr3">
        <miso-button
          v-if="singleMetricSelected"
          class="mr2"
          type="outline"
          @click="showEditForm">
          Edit
        </miso-button>

        <miso-button
          type="outline"
          @click="onShowDeleteModal">
          Delete
        </miso-button>
      </div>

      <miso-button
        type="primary"
        @click="onShowSidePanel('CreateSuccessMetricsForm')"
        class="nowrap">
        Create Success Metric
      </miso-button>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import {
    MisoButton
  } from 'miso'

  export default {
    name: 'settings-success-metrics-table-header',

    props: {
      onShowSidePanel: Function,
      onShowDeleteModal: Function,
      showEditForm: Function
    },

    components: {
      MisoButton
    },

    computed: {
      ...mapGetters([
        'selectedMetricsNum',
        'anyMetricsSelected',
        'singleMetricSelected',
        'metricsNum',
        'filteredMetricsNum'
      ])
    }
  }
</script>
