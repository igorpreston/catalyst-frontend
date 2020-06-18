<template>
  <div class="pa3 pt0 bg-white mb3 h-100 flex flex-column justify-between templates-form">
    <div class="flex items-center justify-between bb b--light-gray fixed z-1 templates-form__heading">
      <miso-heading
        level="4"
        class="mv0 dark-gray">{{ isEditMode ? 'Edit Template' : 'New Template' }}</miso-heading>

      <div class="flex items-center justify-around">
        <div class="pr2 br b--light-gray">
          <miso-button
            type="transparent"
            size="small"
            @click="onTogglePanel">
            <feather-icon
              name="minimize"
              color="mid-gray"
              height="18"
              width="18"
              v-if="expanded"/>
            <feather-icon
              name="maximize"
              color="mid-gray"
              height="18"
              width="18"
              v-else/>
          </miso-button>
        </div>

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

    <miso-form
      class="overflow-y-auto templates-form__form"
      label-position="top"
      @submit.prevent>

      <miso-form-item class="w-100 pb3 mb1">
        <miso-label>Template Name</miso-label>
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
          v-model="name"
          data-vv-name="name"
          variant="white"
          placeholder="Onboarding Call"
          class="w-100"/>
      </miso-form-item>

      <p>
        <miso-badge
          v-show="errors.has('description')"
          size="tiny"
          color="red">
          {{ errors.first('description') }}
        </miso-badge>
      </p>

      <miso-form-item class="w-100">
        <templates-form-compose
          v-validate.disable="'required'"
          ref="templateComposer"
          :on-add-template-task="addTemplateTask"
          :on-add-template-field="addTemplateField"
          :account-fields="filteredAccountFields"
          :contact-fields="filteredContactFields"
          :template-content-plain="editedTemplate && editedTemplate.content_plain"
          :template-content-html="editedTemplate && editedTemplate.content_html"
          v-model="description"
          data-vv-name="description"/>
      </miso-form-item>

      <templates-form-task-field
        v-for="task in templateTasks"
        :key="task.id"
        :on-remove-note-task="removeTemplateTask"
        :task="task"/>

      <templates-form-template-field
        v-for="field in templateFields"
        :key="field.name"
        :on-remove-note-field="removeTemplateField"
        :field="field"/>

    </miso-form>

    <div class="flex items-center justify-between bottom-0 bt b--light-gray fixed pb3 templates-form__footer">
      <miso-checkbox
        v-model="sync"
        label="sync"
        class="fw3">Sync and Log Call</miso-checkbox>

      <miso-button
        type="primary"
        class="f6 order-last"
        @click.prevent="saveTemplate">
        Save
      </miso-button>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

import { mapState, mapActions, mapMutations } from 'vuex'

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

import TemplatesFormCompose from '#/components/templates/templates-form-compose'

import TemplatesFormTaskField from '#/components/templates/templates-form-task-field'
import TemplatesFormTemplateField from '#/components/templates/templates-form-template-field'

export default {
  name: 'TemplatesForm',

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
    TemplatesFormCompose,
    TemplatesFormTemplateField,
    TemplatesFormTaskField
  },

  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    editedTemplate: {
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
      templateName: null,
      templateSync: null,
      description: null,
      availableNoteFields: {
        account: [
          { owner: 'account', key: 'name', name: 'Account Name', value: null },
          { owner: 'account', key: 'phone', name: 'Account Phone', value: null },
          { owner: 'account', key: 'stage', name: 'Account Stage', value: null },
          { owner: 'account', key: 'renewal_date', name: 'Account Renewal Date', value: null },
          { owner: 'account', key: 'description', name: 'Account Description', value: null },
          { owner: 'account', key: 'contract_value', name: 'Account Contract Value', value: null },
          { owner: 'account', key: 'size', name: 'Account Size', value: null },
          { owner: 'account', key: 'industry', name: 'Account Industry', value: null },
          { owner: 'account', key: 'address', name: 'Account Address', value: null }
        ],
        contact: [
          { owner: 'contact', key: 'title', name: 'Contact Title', value: null },
          { owner: 'contact', key: 'email', name: 'Contact Email', value: null },
          { owner: 'contact', key: 'first_name', name: 'Contact First Name', value: null },
          { owner: 'contact', key: 'last_name', name: 'Contact Last Name', value: null },
          { owner: 'contact', key: 'full_name', name: 'Contact Full Name', value: null },
          { owner: 'contact', key: 'address', name: 'Contact Address', value: null }
        ]
      }
    }
  },

  computed: {
    ...mapState({
      serverAccount: state => state.accounts.account,
      serverContact: state => state.contacts.contact,
      currentUser: state => state.auth.currentUser,
      accounts: state => state.accounts.all,
      contacts: state => state.contacts.all,
      templateTasks: state => state.templates.tasks,
      templateFields: state => state.templates.fields,
      templateCategory: state => state.templates.category
    }),

    templateComposer () {
      return this.$refs.templateComposer
    },

    isEditMode () {
      return this.isEdit
    },

    accountFields () {
      return this.availableNoteFields &&
                this.availableNoteFields.account.map(field => ({
                  ...field,
                  value: this.account && this.account[field.key]
                }))
    },

    filteredAccountFields () {
      return this.accountFields.filter(field => !_.includes(this.templateFields, field))
    },

    contactFields () {
      return this.availableNoteFields &&
                this.availableNoteFields.contact.map(field => ({
                  ...field,
                  value: this.contact && this.contact[field.key]
                }))
    },

    filteredContactFields () {
      return this.contactFields.filter(field => !_.includes(this.templateFields, field))
    },

    name: {
      get () {
        if (this.isEditMode) {
          return this.editedTemplate && this.editedTemplate.name
        }

        return this.templateName
      },

      set (name) {
        this.templateName = name
      }
    },

    category: {
      get () {
        return this.templateCategory || 'note'
      }
    },

    sync: {
      get () {
        if (this.templateSync != null) {
          return this.templateSync
        }

        if (this.isEditMode) {
          return this.editedTemplate && this.editedTemplate.sync
        }
      },

      set (sync) {
        this.templateSync = sync
      }
    }
  },

  mounted () {
    if (this.isEditMode) {
      const template = this.editedTemplate

      const fields = template && template.fields.map(field => ({
        key: field.name,
        name: field.title,
        owner: field.owner_type === 'Account' ? 'account' : 'contact',
        value: field.default_value
      }))

      this.setTemplateFields(fields)
      this.setTemplateTasks(template.tasks || [])
    }
  },

  methods: {
    ...mapActions([
      'createTemplate',
      'updateTemplate',
      'addTemplateField',
      'addTemplateTask',
      'removeTemplateField',
      'removeTemplateTask'
    ]),

    ...mapMutations([
      'setTemplateFields',
      'setTemplateTasks'
    ]),

    hideSidePanel () {
      this.onHideSidePanel()
    },

    saveTemplate () {
      this.$validator.validateAll().then((result) => {
        if (!result) return

        const accountFields = this.templateFields &&
                              this.templateFields.filter(field => field.owner === 'account')
                                .map(field => ({
                                  name: field.key,
                                  title: field.name,
                                  owner_type: _.capitalize(field.owner),
                                  default_value: field.value
                                }))
        const contactFields = this.templateFields &&
                              this.templateFields.filter(field => field.owner === 'contact')
                                .map(field => ({
                                  name: field.key,
                                  title: field.name,
                                  owner_type: _.capitalize(field.owner),
                                  default_value: field.value
                                }))

        const templateTasks = this.templateTasks &&
                                this.templateTasks.map(task => ({
                                  id: task.id,
                                  category: task.category,
                                  description: task.description
                                }))
        const template = {
          template: {
            name: this.name,
            category: this.category,
            created_by_id: this.currentUser && this.currentUser.id,
            content_plain: this.templateComposer.editorPlain,
            content_html: this.templateComposer.editorContent,
            sync: this.sync,
            fields: _.concat(accountFields, contactFields),
            tasks: templateTasks
          }
        }

        if (this.isEditMode) {
          this.updateTemplate({ id: this.editedTemplate.id, data: template })
            .then(() => MisoMessage.success('Successfully updated a template'))
            .catch(() => MisoMessage.error('Failed to update a template'))
        } else {
          this.createTemplate({ template })
            .then(() => MisoMessage.success('Successfully created new template'))
            .catch(() => MisoMessage.error('Failed to create new template'))
        }

        this.onHideSidePanel()
      })
    }
  }
}
</script>

<style lang="scss">
  .templates-form {
    &__footer,
    &__heading {
      width: 310px;
      background-color: #fff;
    }

    &__heading {
      padding: 30px 0 22px;
    }

    &__form {
      margin: 90px 0 60px;

      .el-form-item:last-child {
        margin-bottom: 1px;
      }
    }

    &__footer {
      padding-top: 27px;
    }
  }

  .is-expanded {
    .templates-form__heading,
    .templates-form__footer {
      width: 698px
    }
  }
</style>
