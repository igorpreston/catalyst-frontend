<template>
  <templates-form
    :on-hide-side-panel="onHideSidePanel"
    :is-edit="true"
    :edited-template="template"
    :on-toggle-panel="onTogglePanel"
    :expanded="expanded"/>
</template>

<script>
import { mapGetters } from 'vuex'

import TemplatesForm from '#/components/templates/templates-form'

export default {
  name: 'EditTemplateForm',

  components: {
    TemplatesForm
  },

  props: [
    'onHideSidePanel',
    'onTogglePanel',
    'expanded'
  ],

  computed: {
    ...mapGetters(['firstSelectedTemplate', 'currentTemplate', 'isTemplatePresent']),

    template () {
      if (this.isTemplatePresent) {
        return this.currentTemplate
      }

      return this.firstSelectedTemplate
    }
  }
}
</script>
