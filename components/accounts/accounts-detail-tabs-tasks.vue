<template>
  <div class="flex">
    <tasks-table
      :review-mode="reviewMode"
      :on-show-side-panel="onShowSidePanel"
      class="full-height-table--inner"
      destination="account"/>
  </div>
</template>

<script>
import TasksTable from '#/components/tasks/tasks-table'

export default {
  name: 'AccountsDetailTabsTasks',

  components: {
    TasksTable
  },

  props: {
    onShowSidePanel: {
      type: Function,
      default () {}
    },

    reviewMode: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      sidePanelView: null,
      isSidePanelVisible: false
    }
  }
}
</script>
