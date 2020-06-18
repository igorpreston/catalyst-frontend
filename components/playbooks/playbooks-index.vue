<template>
  <main
    id="playbooks"
    class="bg-off-purple vh-100 overflow-hidden flex flex-column">
    <playbooks-header :on-show-side-panel="showSidePanel"/>

    <div class="flex flex-auto relative">

      <playbooks-form-big
        v-if="bigFormVisible || editFormVisible"
        :on-hide-big-form="hideBigForm"/>

      <playbooks-view
        v-if="playbookView"
        :playbook="playbookView"
        :on-close-playbook="closePlaybookView"
        :on-show-edit-form="showBigForm"
        destination="playbook"/>

      <playbooks-table
        v-if="indexTable"
        :side-panel-view="sidePanelView"
        :is-side-panel-visible="isSidePanelVisible"
        :on-show-side-panel="showSidePanel"
        :on-hide-side-panel="hideSidePanel"
        :on-show-playbook-view="showPlaybookView"
        :on-show-edit-form="showBigForm"
        :on-hide-edit-form="hideBigForm"/>

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
          :on-show-big-form="showBigForm"/>
      </miso-side-panel>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'
import { MisoSidePanel } from 'miso'

import PlaybooksHeader from '#/components/playbooks/playbooks-header'
import PlaybooksTable from '#/components/playbooks/playbooks-table'
import PlaybooksView from '#/components/playbooks/playbooks-view'

import PlaybooksForm from '#/components/playbooks/playbooks-form'
import PlaybooksFormBig from '#/components/playbooks/playbooks-form-big'

import CreateEmailForm from '#/components/emails/create-email-form'

import CreateTaskForm from '#/components/tasks/create-task-form'
import EditTaskForm from '#/components/tasks/edit-task-form'

import CreateNoteForm from '#/components/notes/create-note-form'
import EditNoteForm from '#/components/notes/edit-note-form'

import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'
import EditNoteTaskForm from '#/components/tasks/edit-note-task-form'

export default {
  name: 'PlaybooksIndex',

  components: {
    MisoSidePanel,

    PlaybooksHeader,
    PlaybooksTable,

    PlaybooksForm,
    PlaybooksFormBig,
    PlaybooksView,

    CreateEmailForm,

    CreateTaskForm,
    EditTaskForm,

    CreateNoteForm,
    EditNoteForm,

    CreateNoteTaskForm,
    EditNoteTaskForm
  },

  data () {
    return {
      isSidePanelVisible: false,
      sidePanelView: null,
      isExpandedAside: false,
      panelWidth: 341,
      bigFormVisible: false,
      indexTable: true,
      editFormVisible: false
    }
  },

  computed: {
    ...mapGetters(['playbookView']),

    ...mapState({
      playbooks: state => state.playbooks
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

  beforeMount () {
    this.fetchSalesforceUsers()
  },

  methods: {
    ...mapMutations([
      'setPlaybookViewId',
      'setSelectedPlaybooks',
      'resetPlaybookFormData'
    ]),

    ...mapActions([
      'updatePlaybookForm',
      'fetchSalesforceUsers'
    ]),

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
      this.panelWidth = 0
    },

    togglePanel () {
      this.isExpandedAside = !this.isExpandedAside
      switch (this.panelWidth) {
        case 341:
          this.panelWidth = 730
          return
        case 730:
          this.panelWidth = 341
      }
    },

    showBigForm () {
      this.setPlaybookViewId(-1)
      this.updatePlaybookForm()
      this.hideSidePanel()
      this.bigFormVisible = true
      this.indexTable = false
    },

    hideBigForm () {
      this.bigFormVisible = false
      this.indexTable = true
      this.setSelectedPlaybooks([])
      this.resetPlaybookFormData()
    },

    showPlaybookView (row) {
      this.indexTable = false
      this.setPlaybookViewId(row.id)
      this.setSelectedPlaybooks([row])
    },

    closePlaybookView () {
      this.indexTable = true
      this.setPlaybookViewId(-1)
      this.setSelectedPlaybooks([])
      this.resetPlaybookFormData()
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

  .playbooks {
    &__header {
      height: 72px;

      .btn-outline {
        width: 62px;
      }
    }
  }
</style>
