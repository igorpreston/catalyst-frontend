<template>
  <div class="flex flex-auto flex-column items-center mv3">
    <templates-view-preview-item
      :contact="currentRandomContact">
    </templates-view-preview-item>
  </div>
</template>

<script>
  import {
    MisoButton,
    FeatherIcon
  } from 'miso'

  import { mapState } from 'vuex'

  import TemplatesViewPreviewItem from '#/components/templates/templates-view-preview-item'

  export default {
    name: 'templates-view-preview',

    components: {
      MisoButton,
      FeatherIcon,
      TemplatesViewPreviewItem
    },

    data() {
      return {
        contactIndex: 0
      }
    },

    computed: {
      ...mapState({
        'randomContacts': state => state.templates.randomContacts
      }),

      currentRandomContact() {
        return this.randomContacts && this.randomContacts[this.contactIndex]
      },

      counterText() {
        return (this.contactIndex + 1) + " of " + this.randomContacts.length
      },

      isFirstIndex() {
        return !this.contactIndex
      },

      isLastIndex() {
        return this.randomContacts.length === this.contactIndex + 1
      },
    },

    methods: {
      nextContact() {
        this.contactIndex++
      },

      prevContact() {
        this.contactIndex--
      }
    }

  }
</script>

<style scoped>
  .pagination {
    flex: 0 0 auto;
  }
</style>
