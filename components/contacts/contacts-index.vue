<template>
  <main
    id="contacts"
    class="bg-off-purple vh-100 overflow-hidden flex flex-column">
    <contacts-header :on-show-side-panel="showSidePanel"></contacts-header>

    <div class="flex flex-auto relative">
      <div class="flex flex-auto flex-column pa24">
        <contacts-table></contacts-table>
      </div>

      <div
        class="z-10 side-panel-bg"
        v-if="isExpandedAside">
      </div>

      <miso-side-panel
        :visible="isSidePanelVisible"
        :width="panelWidth"
        :style="panelWidthCss"
        :class="isExpanded"
        class="z-10 side-panel">
        <component
          :on-hide-side-panel="hideSidePanel"
          :on-show-side-panel="showSidePanel"
          :on-toggle-panel="togglePanel"
          :expanded="isExpandedAside"
          :is="sidePanelView"
          destination="dashboard">
        </component>
      </miso-side-panel>
    </div>
  </main>
</template>

<script>
  import { mapActions } from 'vuex'

  import {
    MisoButton,
    MisoSidePanel
  } from 'miso'

  import ContactsHeader from '#/components/contacts/contacts-header'
  import ContactsTable from '#/components/contacts/contacts-table'

  import CreateEmailForm from '#/components/emails/create-email-form'

  import CreateTaskForm from '#/components/tasks/create-task-form'
  import EditTaskForm from '#/components/tasks/edit-task-form'

  import TasksRescheduleForm from '#/components/tasks/tasks-reschedule-form'

  import CreateNoteForm from '#/components/notes/create-note-form'
  import EditNoteForm from '#/components/notes/edit-note-form'
  import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'

  export default {
    name: 'contacts-index',

    components: {
      MisoButton,
      MisoSidePanel,

      ContactsHeader,
      ContactsTable,

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
            break;
          case 730:
            this.panelWidth = 341
            break;
          default:
            return
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
      z-index: 2001;
    }
  }

  .is-expanded {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    flex: 0 0 730px;
    z-index: 2001;
  }
</style>
