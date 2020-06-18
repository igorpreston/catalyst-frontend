<template>
  <p class="mv0 truncate two-lines">
    {{ title }}
  </p>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'notes-table-title-column',

    props: ['title']
  }
</script>
