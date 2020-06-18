<template>
  <main class="bg-off-purple vh-100 overflow-hidden flex flex-column">

    <dashboard-header :on-show-side-panel="showSidePanel"/>

    <div class="flex flex-auto relative">

      <tasks-table
        :side-panel-view="sidePanelView"
        :is-side-panel-visible="isSidePanelVisible"
        :on-show-side-panel="showSidePanel"
        :on-hide-side-panel="hideSidePanel"
        class="mh2 mt2"
        destination="dashboard"/>

      <div
        v-if="isExpandedAside"
        class="side-panel-bg"/>

      <miso-side-panel
        :visible="isSidePanelVisible"
        :width="panelWidth"
        :style="panelWidthCss"
        :class="isExpanded"
        class="side-panel">
        <component
          :on-hide-side-panel="hideSidePanel"
          :on-show-side-panel="showSidePanel"
          :on-toggle-panel="togglePanel"
          :expanded="isExpandedAside"
          :is="sidePanelView"
          destination="dashboard"/>
      </miso-side-panel>

    </div>

  </main>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'

import {
  MisoSidePanel
} from 'miso'

import DashboardHeader from '#/components/dashboard/dashboard-header'
import TasksTable from '#/components/tasks/tasks-table'
import CreateEmailForm from '#/components/emails/create-email-form'
import CreateTaskForm from '#/components/tasks/create-task-form'
import EditTaskForm from '#/components/tasks/edit-task-form'
import TasksRescheduleForm from '#/components/tasks/tasks-reschedule-form'
import CreateNoteForm from '#/components/notes/create-note-form'
import EditNoteForm from '#/components/notes/edit-note-form'
import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'

export default {
  name: 'Dashboard',

  components: {
    MisoSidePanel,
    DashboardHeader,
    TasksTable,
    CreateEmailForm,
    CreateTaskForm,
    EditTaskForm,
    TasksRescheduleForm,
    CreateNoteForm,
    EditNoteForm,
    CreateNoteTaskForm
  },

  data () {
    return {
      isSidePanelVisible: false,
      sidePanelView: null,
      isExpandedAside: false,
      panelWidth: 341
    }
  },

  computed: {
    ...mapState({
      page: state => state.tasks.page
    }),

    isExpanded () {
      if (this.isExpandedAside) {
        return 'is-expanded'
      }
    },

    panelWidthCss () {
      return {
        width: this.panelWidth + 'px'
      }
    }
  },

  methods: {
    ...mapMutations(['setNoteFields']),
    ...mapActions(['fetchTasksByDestination']),

    showSidePanel (view) {
      this.isSidePanelVisible = true
      this.sidePanelView = view
      this.isExpandedAside = false
      this.panelWidth = 341
    },

    hideSidePanel () {
      this.isSidePanelVisible = false
      this.sidePanelView = null
      this.isExpandedAside = false
      this.setNoteFields([])
      this.panelWidth = 0
    },

    togglePanel () {
      this.isExpandedAside = !this.isExpandedAside
      switch (this.panelWidth) {
        case 341:
          this.panelWidth = 730
          break
        case 730:
          this.panelWidth = 341
          break
        default:
      }
    }
  }
}
</script>

<style lang="scss">
  .side-panel {
    flex: 0 0 341px;

    &-bg {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: rgba(0, 0, 0, 0.2);
      z-index: 10;
    }
  }

  .is-expanded {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    flex: 0 0 730px;
    z-index: 10;
  }
</style>
