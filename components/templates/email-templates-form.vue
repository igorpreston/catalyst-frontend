<template>
  <div class="pa3 pt0 bg-white mb3 h-100">
    <div class="flex flex-column justify-between h-100">
      <div class="flex items-center justify-between bb b--light-gray z-1 emails-form__heading">
        <miso-heading
          level="4"
          class="mv0 dark-gray">
          {{ isEditMode ? 'Edit Email Template' : 'New Email Template' }}
        </miso-heading>

        <div class="flex items-center justify-around">
          <div class="pr2 br b--light-gray">
            <miso-button
              type="transparent"
              size="small"
              @click="onTogglePanel">
              <feather-icon
                v-if="expanded"
                name="minimize"
                color="mid-gray"
                height="18"
                width="18"/>
              <feather-icon
                v-else
                name="maximize"
                color="mid-gray"
                height="18"
                width="18"/>
            </miso-button>
          </div>

          <div class="pl2">
            <miso-button
              type="transparent"
              size="small"
              @click="onHideSidePanel">
              <feather-icon
                name="x"
                color="mid-gray"
                height="18"
                width="18"/>
            </miso-button>
          </div>
        </div>
      </div>

      <div class="overflow-y-auto emails-form__form">
        <div class="w-100 mb3">
          <miso-label class="db mb2 mid-gray">
            Template Name
          </miso-label>
          <p>
            <miso-badge
              v-show="errors.has('name')"
              size="tiny"
              color="red">
              {{ errors.first('name') }}
            </miso-badge>
          </p>

          <miso-input
            v-validate.disable="'required'"
            v-model="templateData.name"
            data-vv-name="name"
            variant="white"
            placeholder="Enter template name"/>
        </div>

        <div class="w-100 mb3">
          <miso-label class="db mb2 mid-gray">
            Subject
          </miso-label>
          <p>
            <miso-badge
              v-show="errors.has('subject')"
              size="tiny"
              color="red">
              {{ errors.first('subject') }}
            </miso-badge>
          </p>

          <miso-input
            v-validate.disable="'required'"
            v-model="templateData.subject"
            data-vv-name="subject"
            variant="white"
            placeholder="Enter subject"/>
        </div>

        <p>
          <miso-badge
            v-show="errors.has('body')"
            size="tiny"
            color="red">
            {{ errors.first('body') }}
          </miso-badge>
        </p>
        <tasks-review-complete-email-compose
          :account-tokens="filteredAccountTokens"
          :contact-tokens="filteredContactTokens"
          :content="templateData.content"
          :height="350"
          :subject-value="templateData.subject"
          v-model="templateData.content"/>
      </div>

      <div class="pb3 fixed bottom-0 bt b--light-gray emails-form__footer">
        <miso-button
          type="primary"
          class="f6 order-last fr mt2"
          @click.prevent="saveTemplate">
          Save
        </miso-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'

import {
  FeatherIcon,
  MisoBadge,
  MisoButton,
  MisoCheckbox,
  MisoForm,
  MisoFormItem,
  MisoHeading,
  MisoInput,
  MisoLabel,
  MisoMessage
} from 'miso'

import TasksReviewCompleteEmailCompose from '#/components/tasks/tasks-review-complete-email-compose'

export default {
  name: 'EmailTemplatesForm',

  components: {
    FeatherIcon,
    MisoBadge,
    MisoButton,
    MisoCheckbox,
    MisoForm,
    MisoFormItem,
    MisoHeading,
    MisoInput,
    MisoLabel,
    MisoMessage,
    TasksReviewCompleteEmailCompose
  },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    template: {
      type: Object,
      default: null
    },
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    onTogglePanel: {
      type: Function,
      default () {}
    },
    expanded: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      templateData: {
        content: {
          html: null,
          text: null
        },
        name: null,
        subject: null
      },
      availableEmailTokens: {
        account: [
          { owner: 'account', key: 'name', name: 'Account Name', value: '{{ account_name }}' },
          { owner: 'account', key: 'phone', name: 'Account Phone', value: '{{ account_phone }}' },
          { owner: 'account', key: 'stage', name: 'Account Stage', value: '{{ account_stage }}' },
          { owner: 'account', key: 'renewal_date', name: 'Account Renewal Date', value: '{{ account_renewal_date }}' },
          { owner: 'account', key: 'description', name: 'Account Description', value: '{{ account_description }}' },
          { owner: 'account', key: 'contract_value', name: 'Account Contract Value', value: '{{ account_contract_value }}' },
          { owner: 'account', key: 'size', name: 'Account Size', value: '{{ account_size }}' },
          { owner: 'account', key: 'industry', name: 'Account Industry', value: '{{ account_industry }}' },
          { owner: 'account', key: 'address', name: 'Account Address', value: '{{ account_address }}' }
        ],
        contact: [
          { owner: 'contact', key: 'title', name: 'Contact Title', value: '{{ contact_title }}' },
          { owner: 'contact', key: 'email', name: 'Contact Email', value: '{{ contact_email }}' },
          { owner: 'contact', key: 'first_name', name: 'Contact First Name', value: '{{ contact_first_name }}' },
          { owner: 'contact', key: 'last_name', name: 'Contact Last Name', value: '{{ contact_last_name }}' },
          { owner: 'contact', key: 'full_name', name: 'Contact Full Name', value: '{{ contact_full_name }}' },
          { owner: 'contact', key: 'address', name: 'Contact Address', value: '{{ contact_address }}' }
        ]
      }
    }
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser,
      emailTokens: state => state.templates.tokens,
      templateCategory: state => state.templates.category
    }),

    category () {
      return this.templateCategory || 'email'
    },

    isEditMode () {
      return this.isEdit
    },

    accountTokens () {
      return this.availableEmailTokens &&
                this.availableEmailTokens.account
    },

    filteredAccountTokens () {
      return this.accountTokens.filter(token => !_.includes(this.emailTokens, token))
    },

    contactTokens () {
      return this.availableEmailTokens &&
                this.availableEmailTokens.contact
    },

    filteredContactTokens () {
      return this.contactTokens.filter(token => !_.includes(this.emailTokens, token))
    },

    templateComposer () {
      return this.$refs.templateComposer
    }
  },

  watch: {
    template: function () {
      if (this.template) {
        this.templateData.name = this.template.name
        this.templateData.subject = this.template.subject
        this.templateData.content.html = this.template.content_html
      }
    }
  },

  created () {
    if (this.template) {
      this.templateData.name = this.template.name
      this.templateData.subject = this.template.subject
      this.templateData.content.html = this.template.content_html
    }
  },

  methods: {
    ...mapActions(['createTemplate', 'updateTemplate']),

    saveTemplate () {
      this.$validator.validateAll().then((result) => {
        if (!result) return

        const template = {
          template: {
            name: this.templateData.name,
            subject: this.templateData.subject,
            category: this.category,
            created_by_id: this.currentUser && this.currentUser.id,
            content_plain: this.templateData.content.text,
            content_html: this.templateData.content.html
          }
        }

        if (this.isEditMode) {
          this.updateTemplate({ id: this.template.id, data: template })
            .then(() => {
              MisoMessage.success('Successfully updated a template')
              this.onHideSidePanel()
            })
            .catch(() => MisoMessage.error('Failed to update a template'))
        } else {
          this.createTemplate({ template })
            .then(() => {
              MisoMessage.success('Successfully created new template')
              this.onHideSidePanel()
            })
            .catch(() => MisoMessage.error('Failed to create new template'))
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .emails-form {
    &__footer,
    &__heading {
      width: 310px;
      background-color: #fff;
    }

    &__heading {
      padding: 30px 0 22px;
    }

    &__form {
      margin-top: 30px;
      margin-bottom: 90px;
      height: 100%;

      .el-form-item:last-child {
        margin-bottom: 1px;
      }
    }

    &__footer {
      padding-top: 27px;
    }
  }

  .is-expanded {
    .emails-form__heading,
    .emails-form__footer {
      width: 698px
    }
  }
</style>
