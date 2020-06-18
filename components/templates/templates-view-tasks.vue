<template>
  <div class="bb b--light-gray pv24">
    <p
      v-if="tasks"
      class="ma0 f6 templates-view__empty">
      Currently no Tasks
    </p>

    <miso-checkbox-group v-model="checkList">
      <miso-checkbox
        v-for="task in tasks"
        :key="task.id"
        :label="task.id"
        class="flex items-center templates-view__task">
        <h2 class="ttu mid-gray templates-view__heading">{{ task.category }}</h2>
        <p class="task__description">{{ task.description }}</p>
        <small class="task__estimate">High Priority</small>
      </miso-checkbox>
    </miso-checkbox-group>
  </div>
</template>

<style lang="scss">
  .templates-view__task {
    display: flex;

    & + & {
      margin: 0 0 16px;
    }

    .el-checkbox__label {
      margin-left: 12px;
      padding-left: 12px;
      border-left: 1px solid #E5E2F9;
      white-space: normal;
    }

    .task {
      &__description {
        margin: 0 0 8px;
        font-weight: 300;
        color: #404046;
      }

      &__estimate {
        font-size: 12px;
        color: #9C9CA6;
      }
    }

    .el-checkbox__input.is-checked .el-checkbox__inner {
      border-color: #EAEAEC;
    	background-color: #F4F4F4;
      &::after {
        border-color: #CACACF;
      }
    }

    .el-checkbox__input.is-checked + .el-checkbox__label {
      opacity: .3;
      .task__description {
        text-decoration: line-through;
      }
    }
  }
</style>

<script>
import {
  MisoCheckboxGroup,
  MisoCheckbox
} from 'miso'

export default {

  name: 'TemplatesViewTask',

  components: {
    MisoCheckboxGroup,
    MisoCheckbox
  },
  props: ['tasks'],

  data () {
    return {
      checkList: []
    }
  }
}
</script>
