<template>
  <templates-form
    :on-hide-side-panel="onHideSidePanel"
    :on-toggle-panel="onTogglePanel"
    :expanded="expanded"/>
</template>

<script>
import TemplatesForm from '#/components/templates/templates-form'

export default {
  name: 'CreateTemplateForm',

  components: {
    TemplatesForm
  },

  props: [
    'onHideSidePanel',
    'onTogglePanel',
    'expanded'
  ]
}
</script>
