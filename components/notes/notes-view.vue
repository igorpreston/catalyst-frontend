<template>
  <div class="flex flex-auto flex-column note-view">
    <notes-view-header
      :on-close="onClose"
      :note="note"
      :on-show-side-panel="onShowSidePanel"/>
    <div class="flex overflow-x-auto">
      <div class="flex flex-auto flex-column br b--light-gray note-view__info overflow-y-auto">
        <notes-view-info
          class="info__item"
          :note="note"/>
      </div>
      <div class="flex-auto note-view__description">
        <notes-view-description
          :note="note"
          class="info__item"/>

        <notes-view-fields
          v-if="fields.length"
          class="info__item"
          :note="note"
          :fields="fields"/>

        <notes-view-tasks
          v-if="tasks.length"
          class="info__item"
          :note="note"
          :tasks="tasks"/>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  $spacing: 24px;

  .note-view {
    padding: 0 $spacing;
    color: #404046;

    &__heading {
      margin: 0 0 10px;
      font-size: 12px;
      line-height: 15px;
    }

    &__info,
    &__description {
      margin: $spacing 0 0;
    }

    &__description {
      min-width: 600px;
      padding-left: $spacing;
    }
  }

  .info {
    &__item {
      margin: 0 0 $spacing;
    }
  }
</style>

<script>
import NotesViewHeader from '#/components/notes/notes-view-header'
import NotesViewInfo from '#/components/notes/notes-view-info'
import NotesViewFields from '#/components/notes/notes-view-fields'
import NotesViewTasks from '#/components/notes/notes-view-tasks'
import NotesViewDescription from '#/components/notes/notes-view-description'

export default {
  name: 'NotesView',

  components: {
    NotesViewHeader,
    NotesViewInfo,
    NotesViewFields,
    NotesViewTasks,
    NotesViewDescription
  },

  props: ['note', 'onClose', 'onShowSidePanel'],

  computed: {
    fields () {
      return this.note.note_fields
    },

    tasks () {
      return this.note.tasks
    }
  }
}
</script>
