<template>
  <header class="pv3 ph24 flex items-center justify-between ba b--light-gray bg-white w-100 playbooks__header">
    <div class="flex items-center w-30">
      <miso-label class="label">Title</miso-label>

      <miso-input
        v-validate.disable="'required'"
        :value="playbookFormData.name"
        data-vv-name="title"
        variant="white"
        placeholder="Input playbook's name"
        @input="val => setValue('name', val)"/>
    </div>
    <miso-badge
      v-show="errors.has('title')"
      size="tiny"
      color="red">
      {{ errors.first('title') }}
    </miso-badge>

    <div class="flex items-center ml-auto">
      <div class="flex items-center justify-end pr3 f6">
        <span
          :class="playbookFormData.active ? 'active' : 'unactive'"
          class="switch">
          Paused
        </span>

        <el-switch
          :value="playbookFormData.active"
          :width="40"
          active-color="#3DBA88"
          inactive-color="#E74C3B"
          @click.prevent
          @input="val => setValue('active', val)"/>

        <span
          :class="playbookFormData.active ? 'unactive' : 'active'"
          class="switch">
          Active
        </span>
      </div>

      <div class="ph3 bl br b--light-gray">
        <miso-button
          type="outline"
          @click="saveForm">
          Save
        </miso-button>
      </div>

      <div class="pl3">
        <miso-button
          type="transparent"
          size="tiny"
          class="pa1"
          @click="onHideBigForm">
          <feather-icon
            name="x"
            height="20"
            width="20"
            color="gray"/>
        </miso-button>
      </div>
    </div>
  </header>
</template>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from 'vuex'

import {
  FeatherIcon,
  MisoBadge,
  MisoButton,
  MisoInput,
  MisoLabel,
  MisoMessage
} from 'miso'

import { Switch } from 'element-ui'

export default {
  name: 'PlaybooksFormBigHeader',

  components: {
    FeatherIcon,
    MisoBadge,
    MisoButton,
    MisoInput,
    MisoLabel,
    MisoMessage,
    'el-switch': Switch
  },

  inject: {
    $validator: '$validator'
  },

  props: {
    onHideBigForm: {
      type: Function,
      default () {}
    }
  },

  computed: {
    ...mapGetters(['playbookFormData']),
    ...mapState({
      playbooks: state => state.playbooks
    })
  },

  methods: {
    ...mapMutations(['setPlaybookFormdata']),
    ...mapActions(['createPlaybook', 'updatePlaybook']),

    setValue (key, value) {
      this.setPlaybookFormdata({ key, value })
    },

    saveForm () {
      this.$validator.validateAll().then((result) => {
        if (!result) return

        if (!this.playbooks.selected.length) {
          this.createPlaybook({ data: this.playbookFormData })
            .then(() => {
              MisoMessage.success('Playbook created')
              this.onHideBigForm()
            })
            .catch(() => MisoMessage.error('Something went wrong with playbook creation'))
        } else {
          this.updatePlaybook({ data: this.playbookFormData, id: this.playbookFormData.id })
            .then(() => {
              MisoMessage.success('Playbook updated')
              this.onHideBigForm()
            })
            .catch(() => MisoMessage.error('Something went wrong with playbook update'))
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .el-switch {
    margin: 0 10px;
  }

  .switch {
    &.active {
      color: #9C9CA6;
    }

    &.unactive {
      color: #404046;
    }
  }

  .label {
    margin: 0 1rem 0 0 !important;
  }
</style>
