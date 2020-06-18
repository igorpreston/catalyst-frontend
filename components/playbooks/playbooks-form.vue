<template>
  <div class="pa3 pt0 bg-white mb3 h-100 flex flex-column justify-between playbooks-form">
    <div class="flex items-center justify-between bb b--light-gray playbooks-form__heading">
      <miso-heading
        level="4"
        class="mv0 dark-gray">
        New Playbook
      </miso-heading>

      <div class="flex items-center justify-around bl b--light-gray">
        <div class="pl2">
          <miso-button
            type="transparent"
            size="small"
            @click="hideSidePanel">
            <feather-icon
              name="x"
              color="mid-gray"
              height="18"
              width="18"/>
          </miso-button>
        </div>
      </div>
    </div>

    <div class="flex flex-auto flex-column">
      <miso-form
        label-position="top"
        @submit.native.prevent>

        <miso-form-item class="w-100" data-cy="name">
          <miso-label>Name</miso-label>
          <miso-badge
            v-show="errors.has('name')"
            size="tiny"
            color="red">
            {{ errors.first('name') }}
          </miso-badge>

          <miso-input
            v-validate.disable="'required'"
            v-model="playbookFormData.name"
            variant="white"
            placeholder="Acme Inc"
            class="w-100"
            data-vv-name="name"/>
        </miso-form-item>

        <miso-form-item class="w-100">
          <miso-label>Description (optional)</miso-label>

          <miso-input
            :value="playbookFormData.description"
            variant="white"
            placeholder="A great description…"
            class="w-100"
            @input="val => setValue('description', val)"/>
        </miso-form-item>
      </miso-form>
    </div>

    <div class="flex items-center justify-end bt b--light-gray playbooks-form__footer">
      <miso-button
        type="primary"
        class="f6 order-last"
        @click.prevent="showBigForm">
        Create
      </miso-button>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex'
import {
  MisoHeading,
  MisoButton,
  MisoBadge,
  FeatherIcon,
  MisoForm,
  MisoFormItem,
  MisoInput,
  MisoCheckbox,
  MisoMessage,
  MisoLabel,
  MisoCascader
} from 'miso'

export default {
  name: 'PlaybooksForm',

  components: {
    MisoHeading,
    MisoButton,
    MisoBadge,
    FeatherIcon,
    MisoForm,
    MisoFormItem,
    MisoInput,
    MisoCheckbox,
    MisoMessage,
    MisoLabel,
    MisoCascader
  },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    onShowBigForm: {
      type: Function,
      default () {}
    }
  },

  data () {
    return {
      name: '',
      description: ''
    }
  },

  computed: {
    ...mapGetters(['playbookFormData']),

    isEditMode () {
      return this.isEdit
    }
  },

  methods: {
    ...mapMutations(['setPlaybookFormdata']),

    hideSidePanel () {
      this.onHideSidePanel()
    },

    showBigForm () {
      this.$validator.validateAll().then((result) => {
        if (!result) return

        this.onShowBigForm()
        this.name = ''
        this.description = ''
      })
    },

    setValue (key, value) {
      this.setPlaybookFormdata({ key, value })
    }
  }
}
</script>

<style lang="scss">
  .playbooks-form {
    &__heading {
      margin-bottom: 19px;
      padding: 30px 0 22px;
    }

    &__footer {
      padding-top: 27px;
    }
  }
</style>

<style lang="scss" scoped>
  .trigger {
    &__edit {
      height: 22px;
    }

    &__label {
      width: 40px;
    }

    &__choose {
      width: 270px;
    }
  }
</style>
