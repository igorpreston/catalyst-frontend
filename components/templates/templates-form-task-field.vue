<template>
  <div class="mv3 flex justify-between">
    <miso-input
      variant="white"
      name="task-field"
      :prepend-icon="taskIcon"
      ref="task"
      style="width: 85%;"
      v-model="task.description"
      :autoselect="true"
      placeholder="Please enter a description">
    </miso-input>
    <miso-button type="transparent" class="mh1" @click.prevent="onRemoveNoteTask(task)">
      <feather-icon
        name="x-circle"
        width="16"
        height="16"
        color="dark-gray">
      </feather-icon>
    </miso-button>
  </div>
</template>

<script>
  import Vue from 'vue'

  import {
    MisoInput,
    MisoButton,
    FeatherIcon
  } from 'miso'

  export default {
    name: 'templates-form-task-field',

    props: ['task', 'onRemoveNoteTask'],

    components: {
      MisoInput,
      MisoButton,
      FeatherIcon
    },

    computed: {
      taskIcon () {
        switch (this.task.category) {
          case 'email':
            return 'mail'
          case 'call':
            return 'file'
          default:
            return 'check'
        }
      }
    }
  }
</script>
