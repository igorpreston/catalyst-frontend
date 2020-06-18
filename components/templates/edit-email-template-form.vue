<template>
  <email-templates-form
    :on-hide-side-panel="onHideSidePanel"
    :is-edit="true"
    :on-toggle-panel="onTogglePanel"
    :expanded="expanded"
    :template="template"/>
</template>

<script>
import { mapGetters } from 'vuex'

import EmailTemplatesForm from '#/components/templates/email-templates-form'

export default {
  name: 'EditEmailTemplateForm',

  components: {
    EmailTemplatesForm
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
