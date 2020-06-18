<template>
  <div class="bb b--light-gray">
    <h2 class="ma0 ttu mid-gray note-view__heading">Description</h2>
    <div class="note-view-description ql-editor">
      <span v-html="note.content_html"/>
    </div>
  </div>
</template>

<script>

export default {
  name: 'NotesViewDescription',

  props: {
    note: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss">
  .note-view-description {
    margin-bottom: 25px;
  }
</style>
