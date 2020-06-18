<template>
  <div class="flex flex-auto flex-column">
    <settings-success-metrics-table
      class="settings-success-metrics-table"
      :on-show-side-panel="onShowSidePanel"
      :on-hide-side-panel="onHideSidePanel"
      :show-edit-form="showEditForm"
      destination="settings"/>
  </div>
</template>

<script>
import SettingsSuccessMetricsTable from '#/components/settings/settings-success-metrics-table'
import { mapActions } from 'vuex'

export default {
  name: 'SettingsTabsSuccessMetrics',

  components: {
    SettingsSuccessMetricsTable
  },

  props: {
    onShowSidePanel: Function,
    onHideSidePanel: Function,
    showEditForm: Function
  },

  beforeMount () {
    this.fetchMetrics()
  },

  methods: {
    ...mapActions(['fetchMetrics'])
  }
}
</script>
