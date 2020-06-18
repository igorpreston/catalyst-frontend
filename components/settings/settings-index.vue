<template>
  <main class="bg-off-purple vh-100 overflow-hidden flex flex-auto flex-column">
    <settings-header
      :on-show-side-panel="showSidePanel"/>

    <div class="flex flex-auto relative">

      <div class="flex flex-auto pa24">
        <settings-tabs
          :on-show-side-panel="showSidePanel"
          :show-edit-form="showEditForm"
          :on-hide-side-panel="hideSidePanel"
          :opened-sidebar="isSidePanelVisible"/>
      </div>

      <div
        class="side-panel-bg"
        v-if="isExpandedAside"/>

      <miso-side-panel
        :visible="isSidePanelVisible"
        :width="panelWidth"
        :style="panelWidthCss"
        :class="isExpanded"
        class="side-panel">
        <component
          destination="account"
          :on-hide-side-panel="hideSidePanel"
          :on-show-side-panel="showSidePanel"
          :expanded="isExpandedAside"
          :is-edit="isEdit"
          :is="sidePanelView"/>
      </miso-side-panel>

    </div>

  </main>
</template>

<script>

import { mapState, mapGetters, mapActions } from 'vuex'

import {
  MisoSidePanel
} from 'miso'

import SettingsHeader from '#/components/settings/settings-header.vue'
import SettingsTabs from '#/components/settings/settings-tabs.vue'

import CreateTaskForm from '#/components/tasks/create-task-form'
import EditTaskForm from '#/components/tasks/edit-task-form'

import TasksRescheduleForm from '#/components/tasks/tasks-reschedule-form'

import CreateNoteForm from '#/components/notes/create-note-form'
import EditNoteForm from '#/components/notes/edit-note-form'

import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'
import EditNoteTaskForm from '#/components/tasks/edit-note-task-form'

import CreateUserForm from '#/components/users/create-user-form.vue'
import CreateSuccessMetricsForm from '#/components/settings/create-success-metrics-form.vue'

export default {
  name: 'SettingsIndex',

  components: {
    MisoSidePanel,

    SettingsHeader,
    SettingsTabs,

    CreateTaskForm,
    EditTaskForm,
    TasksRescheduleForm,

    CreateNoteForm,
    EditNoteForm,
    CreateNoteTaskForm,
    EditNoteTaskForm,

    CreateUserForm,
    CreateSuccessMetricsForm
  },

  data () {
    return {
      isSidePanelVisible: false,
      sidePanelView: null,
      isExpandedAside: false,
      panelWidth: 341,
      isEdit: false
    }
  },

  computed: {

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
    ...mapActions(['changeTab']),

    showSidePanel (view) {
      this.isSidePanelVisible = true
      this.sidePanelView = view
      this.panelWidth = 341
    },

    hideSidePanel () {
      this.isSidePanelVisible = false
      this.sidePanelView = null
      this.isExpandedAside = false
      this.panelWidth = 0
      this.isEdit = false
    },

    handleTabClick (tab) {
      this.changeTab(tab.name)
    },

    showEditForm () {
      this.isEdit = true
      this.showSidePanel('CreateSuccessMetricsForm')
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
      z-index: 2;
    }
  }

  .is-expanded {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    flex: 0 0 730px;
    z-index: 2;
  }
</style>
