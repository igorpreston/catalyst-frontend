<template>
  <div class="flex flex-column">
    <h2 class="ttu mid-gray playbooks-view__heading">Actions</h2>

    <div class="flex flex-column">
      <div
        v-for="(action, index) in actions"
        class="flex flex-wrap mb3 f6 items-center action">
        <div class="fw5 action__statement">{{ index === 0 ? 'then' : 'and'}}</div>

        <div class="flex flex-auto items-center action__description">
          <span class="mr3">{{ index + 1 }}.</span>

          <div class="flex mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            {{ toStartCase(action.type) }}
          </div>

          <div class="flex mr2 pa1 ba b--light-gray b--dashed bw1 br2">
            <feather-icon
              :key="index"
              height="14"
              width="14"
              :name="actionIcon(action)"
              class="mr2">
            </feather-icon>
            {{ subAction(action) }}
          </div>
        </div>

        <div
          v-if="action.description || action.days"
          class="flex-auto w-100 mt2 pa3 br2 ba b--light-gray action__inner-text">
          <!-- <h3
            v-if="action.type === 'mail'"
            class="mt0 mb1 f6">
            {{ action.title }}
          </h3> -->

          <p
            v-if="action.description"
            class="mt0 mb2 truncate two-lines">
            {{ action.description }}
          </p>

          <div
            v-if="action.type !== 'add_to_campaign'"
            class="flex flex-auto items-center mid-gray f6">
            <p class="flex ma0">
              {{ action.type === 'create_task' ? 'Due' : 'Send' }}
              {{ action.days }}
              days after trigger
            </p>

            <span
              v-if="action.type === 'create_task'"
              class="mh2 f8 light-gray-accent">
              &bull;
            </span>

            <p
              v-if="action.type === 'create_task'"
              class="flex ma0 fw5"
              :class="priorityColor(action.priority)">
              <feather-icon
                height="16"
                width="16"
                name="alert-circle"
                class="mr1"
                :color="priorityColor(action.priority)">
              </feather-icon>
              {{ toStartCase(action.priority) }}
              priority
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { FeatherIcon } from 'miso'
  import { mapGetters } from 'vuex'

  export default {
    name: 'playbooks-view-actions',

    props: {
      actions: Array
    },

    components: {
      FeatherIcon
    },

    computed: {
      ...mapGetters(['getTemplateNameById', 'getCampaignNameById'])
    },

    methods: {
      actionIcon (action) {
        switch (action.type) {
          case 'create_task':
            switch (action.taskType) {
              case 'email':
                return 'mail'
              case 'call':
                return 'file'
              case 'to_do':
                return 'check'
              default:
                return ''
            }
          case 'send_email':
          case 'add_campaign':
            return 'mail'
          default:
            return ''
        }
      },

      subAction (action) {
        switch (action.type) {
          case 'create_task':
            return this.toStartCase(action.taskType) + ' Task'
          case 'send_email':
            return this.getTemplateNameById(action.template_id)
          case 'add_campaign':
            return this.getCampaignNameById(action.campaign)
          default:
            return ''
        }
      },

      priorityColor (priority) {
        switch (priority) {
          case 'high':
            return 'red'
          case 'regular':
            return 'green'
          default:
            return ''
        }
      },

      toStartCase (text) {
        return _.startCase(text)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .action {
    &__statement {
      flex: 0 0 64px;
      color: #404046;
    }

    &__description {
      flex: 0 0 auto;
    }

    &__inner-text {
      max-width: 700px;
    }
  }

  .yellow {
    color: #FEC301;
  }

  .truncate.two-lines {
    line-height: 20px;
    max-height: 40px;
  }
</style>
