<template>
  <div class="flex flex-auto">

    <tasks-filter
      :visible="isFilterVisible"
      :destination="destination"
      :on-toggle-filter-visible="toggleFilterVisible"
    />

    <div class="flex-auto ph3">

      <tasks-table-header
        :is-filter-visible="isFilterVisible"
        :review-mode="reviewMode"
        :on-show-side-panel="onShowSidePanel"
        :on-show-delete-modal="showDeleteModal"
        :on-toggle-filter-visible="toggleFilterVisible"/>

      <tasks-table-body
        :destination="destination"
        :on-show-side-panel="onShowSidePanel"/>
    </div>

    <tasks-modal-delete
      :destination="destination"
      :is-visible="isDeleteModalVisible"
      :on-hide-delete-modal="hideDeleteModal"
      :on-delete-tasks="onDeleteTasks"/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import {
  MisoSidePanel,
  MisoPagination,
  MisoMessage
} from 'miso'

import TasksFilter from '#/components/tasks/tasks-filter'

import TasksTableHeader from '#/components/tasks/tasks-table-header'
import TasksTableBody from '#/components/tasks/tasks-table-body'

import CreateTaskForm from '#/components/tasks/create-task-form'
import EditTaskForm from '#/components/tasks/edit-task-form'

import TasksRescheduleForm from '#/components/tasks/tasks-reschedule-form'

import TasksModalDelete from '#/components/tasks/tasks-modal-delete'

export default {
  name: 'TasksTable',

  components: {
    MisoSidePanel,
    MisoPagination,
    MisoMessage,

    TasksFilter,
    TasksTableHeader,
    TasksTableBody,

    CreateTaskForm,
    EditTaskForm,

    TasksRescheduleForm,
    TasksModalDelete
  },

  props: {
    isSidePanelVisible: {
      type: Boolean,
      default: false
    },
    onShowSidePanel: {
      type: Function,
      default () {}
    },
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    destination: {
      type: String,
      default: null
    },
    reviewMode: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      isFilterVisible: false,
      isDeleteModalVisible: false
    }
  },

  computed: {
    ...mapGetters([
      'selectedTasksNum'
    ])
  },

  methods: {
    ...mapActions(['updateTaskPage', 'deleteTasks', 'fetchTasksByDestination']),

    toggleFilterVisible () {
      this.isFilterVisible = !this.isFilterVisible
    },

    showDeleteModal () {
      this.isDeleteModalVisible = true
    },

    hideDeleteModal () {
      this.isDeleteModalVisible = false
    },

    onDeleteTasks () {
      this.hideDeleteModal()

      this.deleteTasks()
        .then(() => {
          MisoMessage.success(`Successfully deleted ${this.selectedTasksNum} tasks`)
          this.fetchTasksByDestination({ page: 1, destination: this.destination })
        })
        .catch(() => MisoMessage.error(`Failed to delete ${this.selectedTasksNum} tasks`))
    }
  }
}
</script>
