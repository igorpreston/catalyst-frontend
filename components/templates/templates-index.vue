<template>
  <main id="templates" class="bg-off-purple vh-100 overflow-hidden flex flex-column">

    <templates-header :on-show-side-panel="showSidePanel"></templates-header>

    <div class="flex flex-auto relative">

      <templates-table
        :side-panel-view="sidePanelView"
        :is-side-panel-visible="isSidePanelVisible"
        :on-show-side-panel="showSidePanel"
        :on-hide-side-panel="hideSidePanel">
      </templates-table>

      <div
        class="side-panel-bg"
        v-if="isExpandedAside">
      </div>

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
          :is="sidePanelView">
        </component>
      </miso-side-panel>

    </div>
  </main>
</template>

<script>
  import Vue from 'vue'

  import { mapMutations } from 'vuex'

  import {
    MisoSidePanel
  } from 'miso'

  import TemplatesHeader from '#/components/templates/templates-header'
  import TemplatesTable from '#/components/templates/templates-table'
  import CreateEmailForm from '#/components/emails/create-email-form'
  import CreateTemplateForm from '#/components/templates/create-template-form'
  import EditTemplateForm from '#/components/templates/edit-template-form'

  import CreateEmailTemplateForm from '#/components/templates/create-email-template-form'
  import EditEmailTemplateForm from '#/components/templates/edit-email-template-form'

  import CreateTaskForm from '#/components/tasks/create-task-form'
  import EditTaskForm from '#/components/tasks/edit-task-form'

  import CreateNoteForm from '#/components/notes/create-note-form'
  import EditNoteForm from '#/components/notes/edit-note-form'

  import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'
  import EditNoteTaskForm from '#/components/tasks/edit-note-task-form'

  export default {
    name: 'templates-index',

    components: {
      MisoSidePanel,

      TemplatesHeader,
      TemplatesTable,
      CreateEmailForm,
      CreateTemplateForm,
      EditTemplateForm,

      CreateEmailTemplateForm,
      EditEmailTemplateForm,

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
      ...mapMutations([
        'setTemplateFields',
        'setTemplateTasks'
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

        this.setTemplateFields([])
        this.setTemplateTasks([])
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
