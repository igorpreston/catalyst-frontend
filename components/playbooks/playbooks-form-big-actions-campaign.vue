<template>
  <div class="flex flex-0">
    <div class="flex flex-auto relative action__select">
      <feather-icon
        v-if="action.campaign"
        width="16"
        height="16"
        name="mail"
        class="absolute z-1 item__icon"/>

      <miso-select
        v-validate.disable="'required'"
        :class="{ 'selected' : selectedCampaign !== '' }"
        :data-vv-name="index + '_action_item'"
        v-model="campaign"
        clearable
        filterable
        class="mb3 mr2 white-select campaign__item"
        placeholder="Select Campaign"
        variant="white"
        data-vv-as="item">
        <miso-option
          v-for="item in campaigns"
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

      <miso-select
        v-validate.disable="'required'"
        v-if="playbookFormData.object === 'account' && selectedCampaignIsNotEmpty"
        :data-vv-name="index + '_action_role'"
        v-model="role"
        clearable
        filterable
        class="mr2 white-select campaign__role"
        placeholder="Select Role"
        variant="white"
        data-vv-as="role">
        <miso-option
          v-for="item in roles"
          :key="item.value"
          :label="item.name"
          :value="item.value"/>
      </miso-select>
    </div>

    <p>
      <miso-badge
        v-show="errors.has(index + '_action_item')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_action_item') }}
      </miso-badge>
      <miso-badge
        v-show="errors.has(index + '_action_role')"
        size="tiny"
        color="red">
        {{ errors.first(index + '_action_role') }}
      </miso-badge>
    </p>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from 'vuex'
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
  name: 'PlaybooksFormBigActionsCampaign',

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
      selectedCampaign: '',
      selectedRole: '',
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
    ...mapGetters(['playbookFormData']),
    ...mapState({
      campaigns: state => state.playbooks.campaigns
    }),

    campaign: {
      get () {
        return this.action.campaign || this.selectedCampaign
      },

      set (value) {
        this.selectedCampaign = value
        this.updateType('campaign', value)
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

    selectedCampaignIsNotEmpty () {
      return !_.isEmpty(this.selectedCampaign)
    }
  },

  methods: {
    ...mapMutations(['setAction']),

    updateType (key, value) {
      this.setAction({ index: this.index, action: { [key]: value } })
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
        width: 34px;
      }
    }
  }

  .campaign {
    &__role {
      width: 110px !important;
    }
  }
</style>
