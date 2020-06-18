<template>
  <div class="bb b--light-gray pv24">
    <p
      v-if="fields"
      class="ma0 f6 templates-view__empty">
      Currently no Note Fields
    </p>

    <miso-form>
      <miso-form-item
        v-for="field in fields"
        :key="field.title"
        class="templates-view__field">
        <miso-label>{{ field.title }}</miso-label>

        <miso-input
          :placeholder="field.default_value"
          disabled
          variant="white"/>
      </miso-form-item>
    </miso-form>
  </div>
</template>

<style lang="scss">
  .templates-view__field {
    margin-bottom: 5px;

    &:last-child {
      margin-bottom: 24px;
    }
  }

  .field__select {
    .el-input__inner[disabled] {
      border-color: #eaeaec;
      color: #9c9ca6;
      background-color: #f4f4f4;
    }
  }
</style>

<script>
import {
  MisoForm,
  MisoFormItem,
  MisoSelect,
  MisoOption,
  MisoInput,
  MisoLabel
} from 'miso'

export default {
  name: 'TemplatesViewFields',

  components: {
    MisoForm,
    MisoFormItem,
    MisoSelect,
    MisoOption,
    MisoInput,
    MisoLabel
  },

  props: ['fields']
}
</script>
