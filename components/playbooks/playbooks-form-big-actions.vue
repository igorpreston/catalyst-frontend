<template lang="html">
  <div class="flex flex-column pv24">
    <miso-label>Actions</miso-label>

    <div class="flex flex-column f6">
      <div
        v-for="(action, index) in actions"
        :key="index"
        class="flex flex-auto flex-wrap relative action">
        <div class="flex fw5 mt2 action__statement">{{ index === 0 ? 'then' : 'and' }}</div>

        <div class="flex action__description">
          <p class="mt2 mb0 mr3">{{ index + 1 }}.</p>

          <miso-select
            v-validate.disable="'required'"
            :data-vv-name="index + '_action'"
            v-model="playbookFormData.actions[index].type"
            clearable
            filterable
            class="mb3 mr2 white-select action__select"
            placeholder="Choose Action"
            variant="white"
            data-vv-as="action"
            data-cy="action"
            @change="changeActionType"
            @clear="onClearActionType">
            <div/>
            <miso-option
              v-for="type in actionsTypes"
              :key="type.value"
              :label="type.name"
              :value="type.value"/>
          </miso-select>

          <component
            v-if="action.type"
            :is="actionComponent(action.type)"
            :action="action"
            :index="index"/>

          <miso-button
            class="absolute right-0 action__delete"
            type="transparent"
            @click="deleteAction(index)">
            <feather-icon
              height="16"
              width="16"
              name="x-circle"
              color="mid-gray"/>
          </miso-button>
        </div>
        <p>
          <miso-badge
            v-show="errors.has(index + '_action')"
            size="tiny"
            color="red">
            {{ errors.first(index + '_action') }}
          </miso-badge>
        </p>
      </div>

      <div>
        <miso-button
          type="outline"
          @click="addAction">
          Add More
        </miso-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from 'vuex'

import {
  MisoLabel,
  MisoBadge,
  MisoButton,
  MisoSelect,
  MisoOption,
  FeatherIcon
} from 'miso'

import PlaybooksFormBigActionsTask from '#/components/playbooks/playbooks-form-big-actions-task'
import PlaybooksFormBigActionsEmail from '#/components/playbooks/playbooks-form-big-actions-email'
// TODO: Add back campaign
// import PlaybooksFormBigActionsCampaign from '#/components/playbooks/playbooks-form-big-actions-campaign'

export default {
  name: 'PlaybooksFormBigActions',

  components: {
    MisoLabel,
    MisoBadge,
    MisoButton,
    MisoSelect,
    MisoOption,
    FeatherIcon,
    PlaybooksFormBigActionsTask,
    PlaybooksFormBigActionsEmail// ,
    // TODO: Add back campaign
    // PlaybooksFormBigActionsCampaign
  },

  inject: {
    $validator: '$validator'
  },

  computed: {
    ...mapGetters(['playbookFormData', 'isJustworks']),
    ...mapState({
      actions: state => { return state.playbooks.form.actions }
    }),

    actionsTypes () {
      if (this.isJustworks) {
        return [
          {
            value: 'create_task',
            name: 'Create Task'
          },
          {
            value: 'send_email',
            name: 'Send Automated Email'
          }
          // TODO: Add back campaigns
          // {
          //   value: 'add_campaign',
          //   name: 'Add to Campaign'
          // }
        ]
      } else {
        return [
          {
            value: 'create_task',
            name: 'Create Task'
          }
        ]
      }
    }
  },

  methods: {
    ...mapMutations([
      'addAction',
      'setAction',
      'deleteAction'
    ]),

    actionComponent (type) {
      switch (type) {
        case 'create_task':
          return 'PlaybooksFormBigActionsTask'
        case 'send_email':
          return 'PlaybooksFormBigActionsEmail'
        // TODO: Add back campaign
        /* case 'add_campaign':
          return 'PlaybooksFormBigActionsCampaign' */
        default:
          return ''
      }
    },

    changeActionType (type) {
      this.setAction({ index: this.index, action: { type } })
    },

    onClearActionType () {
      this.setAction({ index: this.index, action: {}, replace: true })
    }
  }
}
</script>

<style lang="scss">
  .action {
    flex: 0 0 auto;

    &:last-child {
      margin-bottom: 8px;
    }

    .white-select,
    .white-input {
      width: 165px;
    }

    &__statement {
      flex: 0 0 64px;
      color: #404046;
    }

    &__select {
      .selected {
        .el-input__inner {
          padding-left: 28px;
        }
      }
    }

    &__delete {
      height: 36px;
      padding: 0 10px;
    }
  }
</style>
