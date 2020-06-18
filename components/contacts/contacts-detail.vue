<template>
  <main class="bg-off-purple overflow-hidden flex flex-auto flex-column">

    <contacts-detail-header
      v-if="isHeaderVisible"
      :on-show-side-panel="showSidePanel"/>

    <div class="flex flex-auto relative">

      <div class="flex flex-auto pa24">
        <contacts-detail-tabs
          :class="{ 'if-sidepanel' : isSidePanelVisible }"
          :review-mode="reviewMode"
          :on-show-side-panel="showSidePanel"/>
      </div>

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
          destination="contact"/>
      </miso-side-panel>

    </div>

  </main>
</template>

<script>
import { mapActions, mapState } from 'vuex'

import {
  MisoSidePanel
} from 'miso'

import ContactsDetailHeader from '#/components/contacts/contacts-detail-header'
import ContactsDetailTabs from '#/components/contacts/contacts-detail-tabs'

import CreateEmailForm from '#/components/emails/create-email-form'
import CreateTaskForm from '#/components/tasks/create-task-form'
import EditTaskForm from '#/components/tasks/edit-task-form'

import TasksRescheduleForm from '#/components/tasks/tasks-reschedule-form'

import CreateNoteForm from '#/components/notes/create-note-form'
import EditNoteForm from '#/components/notes/edit-note-form'

import CreateNoteTaskForm from '#/components/tasks/create-note-task-form'
import EditNoteTaskForm from '#/components/tasks/edit-note-task-form'

export default {
  name: 'ContactsDetail',

  components: {
    MisoSidePanel,

    ContactsDetailHeader,
    ContactsDetailTabs,
    CreateEmailForm,
    CreateTaskForm,
    EditTaskForm,
    TasksRescheduleForm,

    CreateNoteForm,
    EditNoteForm,
    CreateNoteTaskForm,
    EditNoteTaskForm
  },

  props: {
    isHeaderVisible: {
      type: Boolean,
      default: true
    },

    reviewMode: {
      type: Boolean,
      default: false
    }
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
      contact: state => state.contacts.contact,
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

  watch: {
    contact: function (newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.fetchTasksByDestination(
          { page: this.page, destination: 'contact' })
      }
    }
  },

  beforeMount () {
    this.fetchSalesforceUsers()
    this.fetchUsers().then(res => {
      if (this.$route.params.contactId) {
        return this.fetchCurrentContact().then(res => {
          return this.fetchTasksByDestination(
            { page: this.page, destination: 'contact' })
        })
      }
    })
  },

  methods: {
    ...mapActions([
      'fetchContact',
      'fetchAccount',
      'fetchTasksByDestination',
      'fetchSalesforceUsers',
      'fetchUsers'
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
          break
        case 730:
          this.panelWidth = 341
          break
        default:
      }
    },

    fetchCurrentContact () {
      if (this.$route.params.contactId) {
        return this.fetchContact(this.$route.params.contactId)
          .then(res => {
            return this.fetchAccount(res.data.account && res.data.account.id)
          })
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
