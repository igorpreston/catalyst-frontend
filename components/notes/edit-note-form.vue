<template>
  <notes-form
    :is-edit="true"
    :note="noteForEdit"
    :on-hide-side-panel="onHideSidePanel"
    :on-show-side-panel="onShowSidePanel"
    :on-toggle-panel="onTogglePanel"
    :destination="destination"
    :expanded="expanded">
  </notes-form>

</template>

<script>
  import Vue from 'vue'

  import { mapGetters } from 'vuex'

  import NotesForm from '#/components/notes/notes-form'

  export default {
    name: 'edit-note-form',

    props: [
      'onHideSidePanel',
      'onShowSidePanel',
      'destination',
      'onTogglePanel',
      'expanded',
      'note'
    ],

    components: {
      NotesForm
    },

    computed: {
      ...mapGetters(['noteForEdit'])
    }
  }
</script>
