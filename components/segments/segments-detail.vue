<template>
  <div class="component-wrap">
    <segments-detail-header
      :segment-name="segment.name"
      :on-show-side-panel="showSidePanel"/>

    <div class="flex flex-auto relative">
      <segments-detail-table
        :segment-type="segment_type"
        :segment-id="segment_id"
        :on-show-side-panel="showSidePanel"
        :side-panel-view="sidePanelView"/>

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
          :on-hide-side-panel="hideSidePanel"
          :on-show-side-panel="showSidePanel"
          :on-toggle-panel="togglePanel"
          :expanded="isExpandedAside"
          :is="sidePanelView"
          :segment-name="segment.name"
          :activities="activities"/>
      </miso-side-panel>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import {
  MisoButton,
  MisoHeading,
  MisoModal,
  MisoMessage,
  FeatherIcon,
  MisoSidePanel
} from 'miso'

import { mapActions, mapMutations } from 'vuex'

import SegmentsDetailHeader from '#/components/segments/segments-detail-header'
import SegmentsDetailFilter from '#/components/segments/segments-detail-filter'
import SegmentsDetailTable from '#/components/segments/segments-detail-table'
import SegmentsDetailActivity from '#/components/segments/segments-detail-activity'

import CreateTemplateForm from '#/components/templates/create-template-form'
import EditTemplateForm from '#/components/templates/edit-template-form'

import CreateEmailTemplateForm from '#/components/templates/create-email-template-form'
import EditEmailTemplateForm from '#/components/templates/edit-email-template-form'

import CreateEmailForm from '#/components/emails/create-email-form'

import CreateTaskForm from '#/components/tasks/create-task-form'
import EditTaskForm from '#/components/tasks/edit-task-form'

import CreateNoteForm from '#/components/notes/create-note-form'
import EditNoteForm from '#/components/notes/edit-note-form'

import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'
import EditNoteTaskForm from '#/components/tasks/edit-note-task-form'

export default {
  name: 'SegmentsDetail',

  components: {
    MisoButton,
    MisoHeading,
    MisoModal,
    MisoMessage,
    FeatherIcon,
    MisoSidePanel,

    SegmentsDetailHeader,
    SegmentsDetailFilter,
    SegmentsDetailTable,
    SegmentsDetailActivity,

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

  props: [
    'segment_type',
    'segment_id'
  ],

  data () {
    return {
      segment: {},
      activities: [],
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

  beforeMount () {
    this.getSegment()
    this.getSegmentActivities()
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
          break
        case 730:
          this.panelWidth = 341
          break
        default:
      }
    },

    getSegment () {
      axios.get(`/segments/${this.segment_id}.json`)
        .then(response => {
          this.segment = response.data
        })
        .catch(err => {
          console.error('segments.json call failed', err)
        })
    },

    getSegmentActivities () {
      axios.get(`/segments/${this.segment_id}/history.json`)
        .then(response => {
          this.activities = response.data
        })
        .catch(err => {
          console.error('segments.json call failed', err)
        })
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
