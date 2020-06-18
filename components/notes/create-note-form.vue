<template>
  <notes-form
    :on-hide-side-panel="onHideSidePanel"
    :on-show-side-panel="onShowSidePanel"
    :destination="destination"
    :on-toggle-panel="onTogglePanel"
    :expanded="expanded"/>
</template>

<script>
import NotesForm from '#/components/notes/notes-form'

export default {
  name: 'CreateNoteForm',

  components: {
    NotesForm
  },

  props: {
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    onShowSidePanel: {
      type: Function,
      default () {}
    },
    destination: {
      type: String,
      default: null
    },
    onTogglePanel: {
      type: Function,
      default () {}
    },
    expanded: {
      type: Boolean,
      default: false
    }
  }
}
</script>
