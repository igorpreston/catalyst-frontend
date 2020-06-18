<template>
  <p class="mv0 truncate three-lines">
    {{ description }}
  </p>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: 'notes-table-description-column',

    props: ['description']
  }
</script>
