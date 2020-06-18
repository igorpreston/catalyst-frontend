<template>
  <div>
    <h2 class="ma0 ttu mid-gray playbooks-view__heading">Description</h2>

    <p class="ma0 f6 lh-title">{{ description }}</p>
  </div>
</template>

<script>
  export default {
    name: 'playbooks-view-description',

    props: {
      description: String
    }
  }
</script>
