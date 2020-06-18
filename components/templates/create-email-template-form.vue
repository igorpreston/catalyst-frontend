<template>
  <email-templates-form
    :on-hide-side-panel="onHideSidePanel"
    :on-toggle-panel="onTogglePanel"
    :expanded="expanded"/>
</template>

<script>
import EmailTemplatesForm from '#/components/templates/email-templates-form'

export default {
  name: 'CreateEmailTemplateForm',

  components: {
    EmailTemplatesForm
  },

  props: [
    'onHideSidePanel',
    'onTogglePanel',
    'expanded'
  ]
}
</script>
