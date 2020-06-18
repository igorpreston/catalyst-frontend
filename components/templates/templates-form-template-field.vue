<template>
  <miso-form-item class="w-100">
    <miso-label>{{ field.name }}</miso-label>

    <div class="flex justify-between">
      <miso-input
        variant="white"
        style="width: 85%;"
        v-model="field.value">
      </miso-input>
      <miso-button type="transparent" class="mh1" @click.prevent="remove">
        <feather-icon
          name="x-circle"
          width="16"
          height="16"
          color="dark-gray">
        </feather-icon>
      </miso-button>
    </div>
  </miso-form-item>
</template>

<script>
  import Vue from 'vue'

  import {
    MisoInput,
    MisoFormItem,
    FeatherIcon,
    MisoButton,
    MisoLabel
  } from 'miso'

  export default {
    name: 'templates-form-note-field',

    props: ['field', 'onRemoveNoteField'],

    components: {
      MisoInput,
      MisoFormItem,
      FeatherIcon,
      MisoButton,
      MisoLabel
    },

    methods: {
      remove () {
        console.log(this.field.value)
        this.onRemoveNoteField(this.field)
      }
    }
  }
</script>
