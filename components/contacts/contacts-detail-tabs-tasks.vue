<template>
  <div class="flex">
    <tasks-table
      destination="contact"
      :review-mode="reviewMode"
      :on-show-side-panel="onShowSidePanel"
      class="full-height-table--inner"/>
  </div>
</template>

<script>
import TasksTable from '#/components/tasks/tasks-table'

export default {
  name: 'ContactsDetailTabsTasks',

  components: {
    TasksTable
  },

  props: ['onShowSidePanel', 'reviewMode'],

  data () {
    return {
      sidePanelView: null,
      isSidePanelVisible: false
    }
  },

  methods: {
    showSidePanel (view) {
      this.isSidePanelVisible = true
      this.sidePanelView = view
    },

    hideSidePanel () {
      this.isSidePanelVisible = false
      this.sidePanelView = null
    }
  }
}
</script>
