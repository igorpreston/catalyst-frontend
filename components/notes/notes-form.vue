<template>
  <div class="pa3 pt0 bg-white mb3 h-100">

    <insert-template-confirm-modal
      :is-visible="isInsertTemplateModalVisible"
      :on-hide-modal="hideInsertTemplateModal"
      :on-confirm="confirmInsertTemplate"
    />

    <div class="flex flex-column justify-between h-100">
      <div
        v-if="!isReview"
        class="flex items-center justify-between bb b--light-gray z-1 notes-form__heading">
        <miso-heading
          level="4"
          class="mv0 dark-gray">
          {{ isEditMode ? 'Edit Note' : 'New Note' }}
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

      <div class="overflow-y-auto notes-form__form">
        <div
          v-if="!isReview"
          class="w-100 mb3">
          <miso-label class="db mb2 mid-gray">Contact (Optional)</miso-label>
          <p>
            <miso-badge
              v-show="errors.has('contact')"
              size="tiny"
              color="red">
              {{ errors.first('contact') }}
            </miso-badge>
          </p>

          <miso-select
            :remote-method="setContactFilterQuery"
            v-model="contact"
            filterable
            clearable
            remote
            name="contact"
            value-key="id"
            data-vv-name="contact"
            data-cy="contact-select-dropdown"
            class="w-100 white-select note-form-select-contacts"
            placeholder="Search by contact name">
            <miso-option
              v-for="filteredContact in contacts"
              :key="filteredContact.id"
              :value="filteredContact"
              :label="filteredContact.full_name">
              <div class="flex">
                <circle-badge
                  variant="dark"
                  class="mr2">
                  {{ filteredContact.name_initials }}
                </circle-badge>
                <div>
                  <p class="mv0">{{ filteredContact.full_name }}</p>
                  <p class="mv0">{{ filteredContact.title }} @ {{ filteredContact.account.name }}</p>
                </div>
              </div>
            </miso-option>
          </miso-select>
        </div>

        <div
          v-if="!isReview"
          class="w-100 mb3">
          <miso-label class="db mb2 mid-gray">Account</miso-label>
          <p>
            <miso-badge
              v-show="errors.has('account')"
              size="tiny"
              color="red">{{ errors.first('account') }}
            </miso-badge>
          </p>

          <miso-select
            v-validate.disable="'required'"
            :remote-method="setAccountFilterQuery"
            v-model="account"
            filterable
            clearable
            remote
            name="account"
            value-key="id"
            data-vv-name="account"
            data-cy="account-select-dropdown"
            class="w-100 white-select note-form-select-accounts"
            placeholder="Search by account name">
            <miso-option
              v-for="account in accounts"
              :key="account.id"
              :value="account"
              :label="account.name">
              <div class="flex">
                <circle-badge
                  variant="dark"
                  class="mr2">
                  {{ account.name_initials }}
                </circle-badge>
                <p class="mv0">{{ account.name }}</p>
              </div>
            </miso-option>
          </miso-select>
        </div>

        <div class="w-100 mb3">
          <miso-label class="db mb2 mid-gray">Title</miso-label>
          <p>
            <miso-badge
              v-show="errors.has('title')"
              size="tiny"
              color="red">{{ errors.first('title') }}
            </miso-badge>
          </p>

          <miso-input
            v-validate.disable="'required'"
            v-model="title"
            variant="white"
            placeholder="Enter the title"
            name="title"
            data-vv-name="title"
            data-cy="title"
            class="w-100"/>
        </div>

        <div class="w-100">
          <miso-label class="db mb2 mid-gray">Description</miso-label>
          <p>
            <miso-badge
              v-show="errors.has('body')"
              size="tiny"
              color="red">
              {{ errors.first('body') }}
            </miso-badge>
          </p>

          <notes-form-compose
            v-loading="isSfFieldsLoading"
            ref="noteComposer"
            :on-add-note-task="addNoteTask"
            :on-add-note-field="addNoteField"
            :on-set-title="setTitle"
            :on-set-sync="setSalesforceSync"
            :on-insert-template="insertTemplate"
            :on-show-insert-template-modal="showInsertTemplateModal"
            :is-template-insert-confirmed="isTemplateInsertConfirmed"
            :account-fields="filteredAccountFields"
            :contact-fields="filteredContactFields"
            :content="(tempNote.content && tempNote.content.content_html) || note.content_html"
            v-model="tempNote.content"/>
        </div>

        <notes-form-note-field
          v-for="field in noteFields"
          :key="field.key"
          :on-remove-note-field="removeNoteField"
          :is-edit-mode="isEditMode"
          :field="field"/>

        <notes-form-task-field
          v-for="task in noteTasks"
          :key="task.id"
          :is-edit-mode="isEditMode"
          :on-show-side-panel="onShowSidePanel"
          :task="task"/>

      </div>

      <div class="pb3 fixed bottom-0 bt b--light-gray notes-form__footer">
        <div>
          <miso-checkbox
            :disabled="task && task.is_completed"
            v-model="salesforceSync"
            label="Sync and Log Call to Salesforce"
            class="fw3"/>
        </div>
        <miso-button
          class="f6 order-last fr mt2 note-from-save-note-button"
          type="primary"
          @click.prevent="saveNoteAndCreateTasks">
          {{ salesforceSync ? 'Save and Finish' : 'Save' }}
        </miso-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import { sidepanel } from '#/components/mixins/sidepanel'

import {
  CircleBadge,
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
  MisoOption,
  MisoSelect
} from 'miso'

import NotesFormCompose from '#/components/notes/notes-form-compose'

import NotesFormTaskField from '#/components/notes/notes-form-task-field'
import NotesFormNoteField from '#/components/notes/notes-form-note-field'

import InsertTemplateConfirmModal from '#/components/notes/insert-template-confirm-modal'

export default {
  name: 'NotesForm',

  components: {
    MisoHeading,
    MisoBadge,
    MisoButton,
    FeatherIcon,
    MisoForm,
    MisoFormItem,
    MisoSelect,
    MisoOption,
    MisoInput,
    MisoCheckbox,
    MisoMessage,
    CircleBadge,
    MisoLabel,
    NotesFormCompose,
    NotesFormTaskField,
    NotesFormNoteField,
    InsertTemplateConfirmModal
  },

  mixins: [sidepanel],

  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    note: {
      type: Object,
      default: () => ({
        account: null,
        contact: null,
        description: null,
        fields: [],
        id: null,
        content_plain: null,
        content_html: null,
        tasks: null,
        title: null
      })
    },
    isReview: {
      type: Boolean,
      default: false
    },
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    destination: {
      type: String,
      default: null
    },
    onShowSidePanel: {
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
    return this.initialData()
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser,
      noteTasks: state => state.notes.tasks,
      task: state => state.tasks.task,
      fields: state => state.notes.fields,
      notes: state => state.notes,
      stateAccount: state => state.accounts.account,
      stateContact: state => state.contacts.contact
    }),

    ...mapGetters(['noteForEdit', 'currentNoteData']),

    salesforceSync: {
      get () {
        if (this.task && this.task.is_completed) {
          return true
        }
        return this.sync
      },
      set (sync) {
        this.sync = sync
      }
    },

    noteFields () {
      if (this.isEditMode && this.noteForEdit) {
        return this.noteForEdit.note_fields.map(field => ({
          ...field,
          key: field.name,
          type: field.salesforce_type,
          label: field.label,
          name: field.name,
          value: field.value,
          values: field.values || null
        }))
      } else {
        return this.fields
      }
    },

    noteComposer () {
      return this.$refs.noteComposer
    },

    accountFields () {
      const object = (this.accountSalesforceFields && this.accountSalesforceFields.length > 0)
        ? this.accountSalesforceFields : this.notes.salesforceFields.account

      if (object) {
        const values = Object.values(object)

        const fields = this.decomposeFields(values, 'account')

        return fields
      }
      return []
    },

    filteredAccountFields () {
      const fields = this.accountFields
        .filter(field => !_.find(this.tempNote.fields || this.note.fields, { key: field.key }))

      return _.sortBy(fields, 'label')
    },

    contactFields () {
      const object = (this.contactSalesforceFields && this.contactSalesforceFields.length > 0)
        ? this.contactSalesforceFields : this.notes.salesforceFields.contact

      if (object) {
        const values = Object.values(object)

        const fields = this.decomposeFields(values, 'contact')

        return fields
      }
      return []
    },

    isSfFieldsLoading () {
      return this.notes.isLoadingDefaultSfFields || this.sfFieldsLoading
    },

    filteredContactFields () {
      const fields = this.contactFields
        .filter(field => !_.find(this.tempNote.fields || this.note.fields, { key: field.key }))

      return _.sortBy(fields, 'label')
    },

    title: {
      get () {
        if (this.tempNote.title === '') {
          return this.tempNote.title
        }
        return (this.tempNote && this.tempNote.title) || (this.note && this.note.title)
      },

      set (title) {
        this.tempNote.title = title
      }
    },

    account: {
      get () {
        return this.tempNote && this.tempNote.account
      },

      set (account) {
        // If there isn't an account set, then don't set the contact to null,
        // since this is from the stored note contact.
        if (this.tempNote.account) {
          this.tempNote.contact = null
        }
        this.tempNote.account = account
      }
    },

    contact: {
      get () {
        return this.tempNote && this.tempNote.contact
      },
      set (contact) {
        this.tempNote.contact = contact
      }
    },

    isEditMode () {
      return this.isEdit
    },

    currentNote () {
      return this.notes.all.find(note => this.task.note_id === note.id)
    },

    getDestinationId () {
      let id = null
      if (this.task && this.task.contact) {
        id = this.task.contact.id
      } else if (this.task && this.task.account) {
        id = this.task.account.id
      }
      return id
    }
  },

  watch: {
    // whenever question changes, this function will run
    task: function () {
      Object.assign(this.$data, this.initialData())
      if (this.note && this.note.contact) {
        this.contact = this.note.contact
      } else if (this.task && this.task.contact) {
        this.contact = this.task.contact
      }
      if (this.note && this.note.account) {
        this.account = this.note.account
      } else if (this.task && this.task.account) {
        this.account = this.task.account
      }
    },

    account: function (newAccount, oldAccount) {
      if (newAccount && newAccount.id && (newAccount.id !== (oldAccount && oldAccount.id))) {
        this.fetchContactsByAccount(newAccount.id)
        this.fetchAccountSalesforceFields(newAccount.id)
      } else {
        this.getContacts()
      }
    },

    contact: function (newContact, oldContact) {
      if (newContact) {
        if ((newContact.account && newContact.account.id) !==
          (oldContact && oldContact.account && oldContact.account.id)) {
          this.tempNote.account = newContact.account
        }
        if (newContact.id !== (oldContact && oldContact.id)) {
          this.fetchContactSalesforceFields(newContact.id)
        }
      }
    }
  },

  beforeMount () {
    if (this.note && this.note.contact) {
      this.contact = this.note.contact
    } else if (this.task && this.task.contact) {
      this.contact = this.task.contact
    } else if (this.stateContact) {
      this.contact = this.stateContact
    }
    if (this.note && this.note.account) {
      this.account = this.note.account
    } else if (this.task && this.task.account) {
      this.account = this.task.account
    } else if (this.stateAccount) {
      this.account = this.stateAccount
    }
    this.getAccounts(this.account && this.account.name)
    this.fetchTemplates()
    this.fetchSalesforceFields(this.currentUser.id)
  },

  mounted () {
    if (this.account && this.account.id) {
      this.fetchAccountSalesforceFields(this.account.id)
    }

    if (this.contact && this.contact.id) {
      this.fetchContactSalesforceFields(this.contact.id)
    }

    if (this.note.content_html) {
      this.tempNote.content.content_html = this.note.content_html
    }

    if (this.note.content_plain) {
      this.tempNote.content.content_plain = this.note.content_plain
    }

    if (this.note.tasks) {
      this.tempNote.tasks = this.note.tasks
    }

    if (this.note.id) {
      this.tempNote.id = this.note.id
    }

    if (this.note.note_fields) {
      this.tempNote.fields = this.note.note_fields
    }
  },

  methods: {
    ...mapActions([
      'addNoteField',
      'addNoteTask',
      'appendNoteFields',
      'appendNoteTasks',
      'clearNoteTasks',
      'completeCallTask',
      'createNote',
      'fetchContact',
      'fetchNotes',
      'fetchNotesByAccount',
      'fetchNotesByContact',
      'fetchSalesforceFields',
      'fetchSalesforceFieldsForAccount',
      'fetchSalesforceFieldsForContact',
      'fetchTemplates',
      'removeNoteField',
      'removeNoteTask',
      'updateNote'
    ]),

    ...mapMutations([
      'setNoteFields'
    ]),

    decomposeFields (fields, owner) {
      return fields.map(field => ({
        owner,
        key: field.name,
        type: field.type,
        label: field.label,
        name: field.name,
        value: field.value,
        values: field.values || null
      }))
    },

    fetchAccountSalesforceFields (id) {
      if (id) {
        this.sfFieldsLoading = true
        this.fetchSalesforceFieldsForAccount(id)
          .then(res => {
            this.accountSalesforceFields = res.data
            this.sfFieldsLoading = false
          })
          .catch(err => {
            this.sfFieldsLoading = false
            console.error(err)
          })
      }
    },

    fetchContactSalesforceFields (id) {
      if (id) {
        this.sfFieldsLoading = true
        this.fetchSalesforceFieldsForContact(id)
          .then(res => {
            this.contactSalesforceFields = res.data
            this.sfFieldsLoading = false
          })
          .catch(err => {
            this.sfFieldsLoading = false
            console.error(err)
          })
      }
    },

    initialData () {
      return {
        accountFilterQuery: '',
        contactFilterQuery: '',
        isInsertTemplateModalVisible: false,
        isTemplateInsertConfirmed: false,
        tempNote: {
          account: null,
          contact: null,
          fields: [],
          id: null,
          content: {
            content_plain: null,
            content_html: null
          },
          tasks: null,
          title: null
        },
        sync: false,
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
            { owner: 'contact', key: 'address', name: 'Contact Address', value: null }
          ]
        },
        accountSalesforceFields: {},
        contactSalesforceFields: {},
        sfFieldsLoading: false,
        contacts: [],
        accounts: []
      }
    },
    hideSidePanel () {
      this.onHideSidePanel()
      this.clearNoteTasks()
      this.setNoteFields([])
      // this.updateNotes()
    },
    setTitle (title) {
      this.title = title
    },

    setSalesforceSync (sync) {
      this.salesforceSync = sync
    },

    setAccountFilterQuery (query) {
      this.accountFilterQuery = query
      if (this.account && query === this.account.name) {
        this.getAccounts()
      } else {
        this.getAccounts(query)
      }
    },

    setContactFilterQuery (query) {
      this.contactFilterQuery = query
      if (this.contact && query === this.contact.full_name) {
        this.getAccounts(this.contact.account.name)
      } else {
        this.getContacts(query)
      }
    },

    saveNoteAndCreateTasks () {
      this.saveNote()
    },

    showInsertTemplateModal (template) {
      if (
        !_.isEmpty(this.title) ||
        !_.isEmpty(this.noteComposer.editorPlain) ||
        !_.isEmpty(this.tempNote.tasks || this.note.tasks) ||
        !_.isEmpty(this.tempNote.fields || this.note.fields)
      ) {
        this.isInsertTemplateModalVisible = true
        this.insertedTemplate = template
        return
      }
      this.insertedTemplate = template
      this.insertTemplate()
    },

    hideInsertTemplateModal () {
      this.isInsertTemplateModalVisible = false
    },

    confirmInsertTemplate () {
      this.isInsertTemplateModalVisible = false
      this.insertTemplate()
    },

    insertTemplate () {
      const template = this.insertedTemplate
      this.noteComposer.editorContent = template.content_html

      if (_.isEmpty(this.title)) {
        this.setTitle(template.name)
      }

      this.setSalesforceSync(template.sync)

      const noteFields = template.fields && template.fields.map(field => ({
        key: field.name,
        type: field.type,
        label: field.label,
        name: field.name,
        value: field.default_value,
        values: field.values || null,
        owner: field.owner_type.toLowerCase()
      }))

      this.appendNoteFields(noteFields)

      this.appendNoteTasks(template.tasks)
    },

    updateNotes () {
      let id = this.getDestinationId
      const that = this
      if (!id) {
        this.fetchNotes().then(function () {
          Object.assign(that.note, that.currentNoteData)
        })
      } else if (this.task.contact) {
        this.fetchNotesByContact(id).then(function () {
          Object.assign(that.note, that.currentNoteData)
        })
      } else if (this.task.account) {
        this.fetchNotesByAccount(id).then(function () {
          Object.assign(that.note, that.currentNoteData)
        })
      }
    },

    saveNote () {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        const noteFieldsAttributes =
            this.noteFields &&
            this.noteFields.length >= 1
              ? this.noteFields.reduce((attrs, field) => ([
                ...attrs,
                {
                  id: field.id,
                  key: field.name,
                  salesforce_type: field.type,
                  label: field.label,
                  name: field.name,
                  value: field.value,
                  default_value: field.value,
                  owner_type: field.owner === 'account' ? 'Account' : 'Contact',
                  owner_id: field.owner === 'account' ? this.account && this.account.id : this.contact && this.contact.id
                }
              ]), [])
              : null

        const note = {
          note: {
            title: this.title,
            content_plain: this.tempNote.content.content_plain,
            content_html: this.convertWhitespaces(this.tempNote.content.content_html),
            account_id: this.account && this.account.id,
            contact_id: this.contact && this.contact.id,
            user_id: this.currentUser && this.currentUser.id,
            note_fields_attributes: noteFieldsAttributes,
            salesforce_sync_enabled: this.salesforceSync
          }
        }
        let id = null
        if (this.destination === 'account') {
          id = this.tempNote.account && this.tempNote.account.id
        } else if (this.destination === 'contact') {
          id = this.tempNote.contact && this.tempNote.contact.id
        }
        if (this.note && this.note.id) {
          if (this.task) {
            note.note.note_tasks_attributes = [{task_id: this.task.id, parent_type: 'task'}]
          }
          this.updateNote({
            noteId: this.note.id,
            data: note,
            id,
            destination: this.destination
          })
            .then(() => {
              MisoMessage.success('Successfully updated the note')
              this.insertedTemplate = null
              this.setNoteFields([])
              this.updateNotes()
              for (let i = 0; i < this.noteTasks.length; i++) {
                let task = this.noteTasks[i]
                task.contact = this.contact
                task.note_ids = [this.notes.currentNoteId]
                if (task.contact !== '') {
                  task.account = task.contact.account
                } else {
                  task.account = this.account
                }
              }
              if (this.noteTasks.length > 0) {
                this.onShowSidePanel('CreateNoteTaskForm')
              } else if (this.onHideSidePanel) {
                this.clearNoteTasks()
                this.onHideSidePanel()
              }
              if (this.salesforceSync) {
                this.completeCallTask()
              }
            })
            .catch(() => MisoMessage.error('Failed to update the note'))
        } else {
          if (this.task) {
            note.note.note_tasks_attributes = [{task_id: this.task.id, parent_type: (this.isReview ? 'task' : 'note')}]
          }
          this.createNote({ note, id, destination: this.destination })
            .then(() => {
              MisoMessage.success('Successfully created new note')
              this.insertedTemplate = null
              this.setNoteFields([])
              for (let i = 0; i < this.noteTasks.length; i++) {
                let task = this.noteTasks[i]
                task.contact = this.contact
                task.note_ids = [this.notes.currentNoteId]
                if (task.contact !== '') {
                  task.account = task.contact.account
                } else {
                  task.account = this.account
                }
              }
              if (this.noteTasks.length > 0) {
                this.onShowSidePanel('CreateNoteTaskForm')
              } else if (this.onHideSidePanel) {
                this.clearNoteTasks()
                this.onHideSidePanel()
              }
              if (this.salesforceSync) {
                this.completeCallTask()
              }
            })
            .catch(() => MisoMessage.error('Failed to create new note'))
        }
      })
    },

    convertWhitespaces (text) {
      return text.replace(/(<[^/][^>]*>) +| +(<\/[^>]+>)/g, '&nbsp;').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    }
  }
}
</script>

<style lang="scss">
  .notes-form {
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
      margin-bottom: 120px;
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
    .notes-form__heading,
    .notes-form__footer {
      width: 698px
    }
  }
</style>
