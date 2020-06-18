<template>
  <div class="flex flex-0">
    <div class="flex flex-auto relative action__select">
      <feather-icon
        v-if="selectedTemplate"
        width="16"
        height="16"
        name="mail"
        class="absolute z-1 item__icon"/>

      <miso-select
        v-validate.disable="'required'"
        :class="{ 'selected' : selectedTemplate !== '' }"
        :data-vv-name="index + '_action_template'"
        v-model="template_id"
        clearable
        filterable
        class="mb3 mr2 white-select"
        placeholder="Select Template"
        variant="white"
        data-vv-as="template"
        @clear="onClearTemplate">
        <miso-option
          v-for="item in emailTemplates"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <div class="flex flex-auto">
            <feather-icon
              width="16"
              height="16"
              name="mail"
              class="mr3"/>
            {{ item.name }}
          </div>
        </miso-option>
      </miso-select>
    </div>

    <div
      v-if="selectedTemplateIsNotEmpty"
      class="flex flex-auto">
      <div class="ml3 mt2 mr2">
        Due
      </div>

      <miso-input
        type="number"
        v-validate.disable="'required'"
        :data-vv-name="index + '_action_days'"
        v-model="days"
        variant="white"
        placeholder="1"
        class="mr2 item__days"
        data-vv-as="days"/>

      <div class="mt2 mr2">
        days after trigger
      </div>

      <miso-select
        v-validate.disable="'required'"
        v-if="playbookFormData.object === 'account'"
        :data-vv-name="index + '_action_account'"
        v-model="role"
        clearable
        filterable
        class="mr2 white-select item__role"
        placeholder="Select Role"
        variant="white"
        data-vv-as="account">
        <miso-option
          v-for="item in roles"
          :key="item.value"
          :label="item.name"
          :value="item.value"/>
      </miso-select>
    </div>

    <p>
      <miso-badge
        v-show="errors.has(index + '_action_days')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_action_days') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(index + '_action_template')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_action_template') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(index + '_action_account')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_action_account') }}
      </miso-badge>
    </p>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import _ from 'lodash'

import {
  MisoInput,
  MisoBadge,
  MisoSelect,
  MisoOption,
  MisoButton,
  FeatherIcon
} from 'miso'

export default {
  name: 'PlaybooksFormBigActionsEmail',

  components: {
    MisoInput,
    MisoBadge,
    MisoSelect,
    MisoOption,
    MisoButton,
    FeatherIcon
  },

  props: {
    action: {
      type: Object,
      default: () => ({})
    },
    index: {
      type: Number,
      default: null
    }
  },

  inject: {
    $validator: '$validator'
  },

  data () {
    return {
      selectedTemplate: '',
      selectedDays: '',
      roles: [
        {
          value: 'Decision Maker',
          name: 'Decision Maker'
        },
        {
          value: 'Champion',
          name: 'Champion'
        },
        {
          value: 'Power User',
          name: 'Power User'
        },
        {
          value: 'All',
          name: 'All Contacts'
        }
      ]
    }
  },

  computed: {
    ...mapGetters(['playbookFormData', 'emailTemplates']),

    template_id: {
      get () {
        return this.action.template_id || this.selectedTemplate
      },

      set (value) {
        this.selectedTemplate = value
        this.updateType('template_id', value)
      }
    },

    days: {
      get () {
        return this.action.days || this.selectedDays
      },

      set (value) {
        this.selectedDays = value
        this.updateType('days', value)
      }
    },

    role: {
      get () {
        return this.action.role || this.selectedRole
      },

      set (value) {
        this.selectedRole = value
        this.updateType('role', value)
      }
    },

    selectedTemplateIsNotEmpty () {
      return !_.isEmpty(this.selectedTemplate)
    }
  },

  methods: {
    ...mapMutations(['setAction']),

    updateType (key, value) {
      this.setAction({ index: this.index, action: { [key]: value } })
    },

    onClearTemplate () {
      this.selectedDays = ''
      this.updateType('days', null)
    }
  }
}
</script>

<style lang="scss">
  .item {
    &__icon {
      top: 10px;
      left: 8px;
    }

    &__days {
      flex: 0 0 34px;
      .white-input {
        width: 50px;
      }
    }

    &__role {
      width: 110px !important;
    }
  }
</style>
