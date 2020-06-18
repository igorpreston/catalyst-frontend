<template lang="html">
  <div class="flex flex-column pv24 bb b--light-gray">
    <miso-label>Conditions</miso-label>

    <div class="flex flex-column f6">
      <div
        v-for="(condition, index) in conditions"
        :key="index"
        class="flex flex-auto flex-wrap relative condition">
        <div class="flex fw5 mt2 condition__statement">{{ index === 0 ? 'If' : 'and if' }}</div>

        <div class="flex condition__description">
          <miso-select
            v-validate.disable="'required'"
            :data-vv-name="index + '_condition'"
            :disabled="index != 0"
            :value="playbookFormData.object"
            clearable
            filterable
            class="mr2 white-select"
            value-key="field"
            placeholder="Choose Condition"
            variant="white"
            data-vv-as="condition"
            data-cy="condition"
            @input="setType">
            <miso-option
              v-for="type in types"
              :key="type.value"
              :label="type.name"
              :value="type.value"/>
          </miso-select>

          <playbook-condition-contact
            v-if="objectContactSelected"
            :condition="condition"
            :index="index"/>
          <playbook-condition-account
            v-if="objectAccountSelected"
            :condition="condition"
            :index="index"/>

          <div>
            <miso-button
              class="absolute right-0 condition__delete"
              type="transparent"
              @click="onDeleteCondition(index)">
              <feather-icon
                height="16"
                width="16"
                name="x-circle"
                color="mid-gray"/>
            </miso-button>
          </div>
        </div>
        <p>
          <miso-badge
            v-show="errors.has(index + '_condition')"
            size="tiny"
            color="red">
            {{ errors.first(index + '_condition') }}
          </miso-badge>
        </p>
      </div>

      <div>
        <miso-button
          type="outline"
          @click="addCondition">
          Add More
        </miso-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapState, mapActions } from 'vuex'

import {
  FeatherIcon,
  MisoBadge,
  MisoButton,
  MisoInput,
  MisoLabel,
  MisoOption,
  MisoSelect
} from 'miso'

import PlaybookConditionContact from './playbooks-condition-contact'
import PlaybookConditionAccount from './playbooks-condition-account'

export default {
  name: 'PlaybooksFormBigConditions',

  components: {
    FeatherIcon,
    MisoBadge,
    MisoButton,
    MisoInput,
    MisoLabel,
    MisoOption,
    MisoSelect,
    PlaybookConditionAccount,
    PlaybookConditionContact
  },

  inject: {
    $validator: '$validator'
  },

  data () {
    return {
      types: [
        { value: 'contact', name: 'Contact' },
        { value: 'account', name: 'Account' }
      ]
    }
  },

  computed: {
    ...mapGetters(['playbookFormData']),
    ...mapState({
      conditions: state => { return state.playbooks.form.conditions }
    }),

    objectContactSelected () {
      return this.playbookFormData.object === 'contact'
    },

    objectAccountSelected () {
      return this.playbookFormData.object === 'account'
    }
  },

  methods: {
    ...mapMutations([
      'setPlaybookFormdata',
      'setConditions',
      'addCondition'
    ]),

    ...mapActions([
      'onDeleteCondition'
    ]),

    setValue (key, value) {
      this.setPlaybookFormdata({ key, value })
    },

    setType (type) {
      this.setValue('object', type)
      this.setConditions([{}])
    }
  }
}
</script>

<style lang="scss">
  .condition {
    flex: 0 0 auto;

    &:not(:last-child) {
      margin-bottom: 1rem;
    }

    .white-select,
    .white-input,
    .el-date-editor {
      width: 165px;
    }

    &__statement {
      flex: 0 0 64px;
      color: #404046;
    }

    &__delete {
      height: 36px;
      padding: 0 10px;
    }
  }
</style>
