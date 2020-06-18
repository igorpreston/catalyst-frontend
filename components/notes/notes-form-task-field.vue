<template>
  <div
    class="mv3 flex justify-between pointer">
    <miso-input
      v-focus
      ref="task"
      :autoselect="true"
      :name="'task-field-'+task.id"
      :prepend-icon="taskIcon"
      v-model="task.description"
      variant="white"
      style="width: 85%;"
      placeholder="Please enter a description"/>
    <miso-button
      type="transparent"
      class="mh1"
      @click.prevent="removeNoteTask(task)">
      <feather-icon
        name="x-circle"
        width="16"
        height="16"
        color="dark-gray"/>
    </miso-button>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'

import {
  MisoInput,
  MisoButton,
  FeatherIcon
} from 'miso'

export default {
  name: 'NotesFormTaskField',

  components: {
    MisoInput,
    MisoButton,
    FeatherIcon
  },

  props: {
    task: {
      type: Object,
      default: () => ({
        description: null,
        category: null,
        priority: false,
        due: null,
        account: null,
        contact: null,
        assigned_to: null,
        note_ids: []
      })
    },
    isEditMode: {
      type: Boolean,
      default: false
    },
    onShowSidePanel: {
      type: Function,
      default () {}
    }
  },

  inject: {
    $validator: '$validator'
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
  },

  methods: {
    ...mapActions(['removeNoteTask']),
    ...mapMutations(['setEditableTask']),

    openEditTaskForm () {
      if (this.isEditMode) {
        this.setEditableTask(this.task)
        this.onShowSidePanel('EditNoteTaskForm')
      }
    }
  }
}
</script>

<style>
  .is-disabled input:hover{
    cursor: pointer !important;
  }
</style>
