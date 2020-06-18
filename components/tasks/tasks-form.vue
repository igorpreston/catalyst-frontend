<template>
  <div class="pa3 pt0 bg-white mb3 overflow-y-auto h-100 flex flex-column justify-between tasks-form">
    <div class="flex items-center justify-between bb b--light-gray fixed z-1 tasks-form__heading">
      <miso-heading
        level="4"
        class="mv0 dark-gray">
        {{ isEditMode ? 'Editing Task' : 'New Task' }}
      </miso-heading>

      <miso-button
        type="transparent"
        size="small"
        @click="onHideSidePanel">
        <feather-icon
          name="x"
          color="mid-gray"
          height="16"
          width="16"/>
      </miso-button>
    </div>

    <miso-form
      class="tasks-form__form"
      label-position="top"
      @submit.native.prevent>
      <miso-form-item class="w-100">
        <miso-label>Contact <span v-if="type !== 'email'">(optional)</span></miso-label>
        <miso-badge
          v-show="errors.has('contact')"
          size="tiny"
          color="red">
          {{ errors.first('contact') }}
        </miso-badge>

        <miso-select
          v-validate="emailRules"
          :remote-method="setContactFilterQuery"
          v-model="contact"
          data-vv-name="contact"
          filterable
          clearable
          remote
          name="contact"
          value-key="id"
          class="w-100 white-select"
          placeholder="John Doe">
          <miso-option
            v-for="contact in contacts"
            :key="contact.id"
            :value="contact"
            :label="contact.full_name">
            <div class="flex">
              <circle-badge
                variant="dark"
                class="mr2">
                {{ contact.name_initials }}
              </circle-badge>

              <div>
                <p class="mv0">{{ contact.full_name }}</p>
                <p class="mv0">{{ contact.title }} @ {{ contact.account.name }}</p>
              </div>
            </div>
          </miso-option>
        </miso-select>
      </miso-form-item>

      <miso-form-item class="w-100">
        <miso-label>Account</miso-label>
        <miso-badge
          v-show="errors.has('account')"
          size="tiny"
          color="red">{{ errors.first('account') }}</miso-badge>

        <miso-select
          v-validate.disable="'required'"
          :class="{'is-danger': errors.has('account')}"
          :remote-method="setAccountFilterQuery"
          v-model="account"
          filterable
          clearable
          remote
          name="account"
          data-vv-name="account"
          value-key="id"
          class="w-100 white-select"
          placeholder="Acme Inc">
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
              <div>
                <p class="mv0">{{ account.name }}</p>
              </div>
            </div>
          </miso-option>
        </miso-select>
      </miso-form-item>

      <miso-form-item class="w-100">
        <miso-label>Description <span v-if="type !== 'to_do'">(optional)</span></miso-label>
        <miso-badge
          v-show="errors.has('description')"
          size="tiny"
          color="red">
          {{ errors.first('description') }}
        </miso-badge>

        <el-input
          v-validate="toDoRules"
          :autosize="{ minRows: 3 }"
          v-model="description"
          data-vv-name="description"
          type="textarea"
          resize="true"
          placeholder="A great description…"
          class="miso-custom-input input-reset w-100"/>
      </miso-form-item>

      <miso-form-item class="w-100">
        <miso-label>Type</miso-label>
        <miso-badge
          v-show="errors.has('type')"
          size="tiny"
          color="red">
          {{ errors.first('type') }}
        </miso-badge>

        <miso-select
          v-validate="'required'"
          :class="{'is-danger': errors.has('type')}"
          :has-error="errors.has('type')"
          v-model="type"
          filterable
          data-vv-name="type"
          class="w-100 white-select"
          placeholder="e.g To-Do">
          <miso-option
            value="call"
            label="Call"/>

          <miso-option
            v-if="isJustworks"
            value="email"
            label="Email"/>

          <miso-option
            value="to_do"
            label="To-Do"/>
        </miso-select>
      </miso-form-item>

      <miso-form-item class="w-100">
        <miso-label>Priority</miso-label>
        <miso-badge
          v-show="errors.has('priority')"
          size="tiny"
          color="red">{{ errors.first('priority') }}</miso-badge>

        <miso-select
          v-validate.disable="'required'"
          :class="{'is-danger': errors.has('priority')}"
          v-model="priority"
          filterable
          data-vv-name="priority"
          class="w-100 white-select"
          placeholder="e.g High">
          <miso-option
            :value="false"
            label="Regular"/>
          <miso-option
            :value="true"
            label="High"/>
        </miso-select>
      </miso-form-item>

      <miso-form-item class="w-100">
        <miso-label>Due Date</miso-label>
        <miso-badge
          v-show="errors.has('dueDate')"
          size="tiny"
          color="red">{{ errors.first('dueDate') }}</miso-badge>

        <miso-date-picker
          v-validate.disable="'required'"
          :class="{'is-danger': errors.has('dueDate')}"
          v-model="dueDate"
          data-vv-name="dueDate"
          data-vv-as="due date"
          type="date"
          placeholder="e.g 10/13/2018"
          format="MM/dd/yyyy"
          class="w-100 white-select"
          style="width: 100%;"/>
      </miso-form-item>

      <miso-form-item class="w-100">
        <miso-label>Due Time (optional)</miso-label>

        <miso-select
          v-model="dueTime"
          filterable
          value-key="name"
          class="w-100 white-select"
          placeholder="e.g 12pm">
          <miso-option
            v-for="time in dueTimes"
            :key="time.hour+time.minute"
            :value="time"
            :label="time.name"/>
        </miso-select>
      </miso-form-item>

      <miso-form-item class="w-100">
        <miso-label>Owner</miso-label>
        <miso-badge
          v-show="errors.has('owner')"
          size="tiny"
          color="red">{{ errors.first('owner') }}</miso-badge>

        <miso-select
          v-validate.disable="'required'"
          :class="{'is-danger': errors.has('owner')}"
          :remote-method="setUserFilterQuery"
          v-model="assigned_to"
          filterable
          clearable
          remote
          data-vv-name="owner"
          value-key="id"
          class="w-100 white-select"
          placeholder="Search by user name">
          <miso-option
            v-for="user in alteredUsers"
            :key="user.id"
            :value="user"
            :label="user.name">
            <div class="flex">
              <circle-badge
                variant="dark"
                class="mr2">
                {{ user.name_initials }}
              </circle-badge>
              <div>
                <p class="mv0">{{ user.name }}</p>
              </div>
            </div>
          </miso-option>
        </miso-select>
      </miso-form-item>
    </miso-form>

    <div class="flex items-center justify-end fixed bottom-0 pb3 bt b--light-gray tasks-form__footer">
      <miso-button
        type="primary"
        class="f6"
        @click.prevent="saveTask">
        {{ isEditMode ? 'Save' : 'Create' }}
      </miso-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import { mapState, mapGetters, mapActions } from 'vuex'
import { sidepanel } from '#/components/mixins/sidepanel'

import {
  CircleBadge,
  FeatherIcon,
  MisoBadge,
  MisoButton,
  MisoDatePicker,
  MisoForm,
  MisoFormItem,
  MisoHeading,
  MisoLabel,
  MisoMessage,
  MisoOption,
  MisoSelect,
  MisoTextarea
} from 'miso'

import {
  Input
} from 'element-ui'

export default {
  name: 'TasksForm',

  components: {
    'el-input': Input,
    CircleBadge,
    FeatherIcon,
    MisoBadge,
    MisoButton,
    MisoDatePicker,
    MisoForm,
    MisoFormItem,
    MisoHeading,
    MisoLabel,
    MisoMessage,
    MisoOption,
    MisoSelect,
    MisoTextarea
  },

  mixins: [sidepanel],

  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    task: {
      type: Object,
      default: () => ({
        description: null,
        category: null,
        priority: false,
        due: null,
        account: null,
        contact: null,
        assigned_to: null,
        note_ids: []
      })
    },
    onHideSidePanel: {
      type: Function,
      default () {}
    },
    destination: {
      type: String,
      default: ''
    }
  },

  data () {
    return this.initialData()
  },

  computed: {
    ...mapState({
      currentUser: state => state.auth.currentUser,
      users: state => state.users.all,
      stateAccount: state => state.accounts.account,
      stateContact: state => state.contacts.contact
    }),

    ...mapGetters(['isThereNextTask', 'alteredUsers', 'isJustworks']),

    toDoRules () {
      return this.type === 'to_do' ? 'required' : ''
    },

    emailRules () {
      return this.type === 'email' ? 'required' : ''
    },

    description: {
      get () {
        if (this.tempTask.description === '') {
          return this.tempTask.description
        }
        return this.tempTask.description || this.task.description
      },
      set (description) {
        this.tempTask.description = description
      }
    },

    type: {
      get () {
        if (this.tempTask.category === '') {
          return this.tempTask.category
        }
        return this.tempTask.category || this.task.category
      },

      set (type) {
        this.tempTask.category = type
      }
    },

    priority: {
      get () {
        // checks if property is either null or undefined
        // negation sign evaluates property value to be false which is valid value
        return this.tempTask.priority || this.task.priority || false
      },

      set (priority) {
        this.tempTask.priority = priority
      }
    },

    dueDate: {
      get () {
        if (!this.tempTask.dueDate) {
          return (this.task &&
                   this.task.due &&
                   moment.tz(this.task.due, (this.currentUser && this.currentUser.time_zone) || 'UTC').toDate()) || ''
        }
        return this.tempTask.dueDate
      },

      set (dueDate) {
        this.tempTask.dueDate = (dueDate == null || dueDate === '') ? '' : dueDate
      }
    },

    dueTime: {
      get () {
        if (!this.tempTask.dueTime && this.task && this.task.due) {
          const due = moment.tz(this.task.due, (this.currentUser && this.currentUser.time_zone) || 'UTC')
          const hour = due.hour()
          const minute = due.minute()
          return this.dueTimes.find(time => time.hour === hour && time.minute === minute)
        }

        return this.tempTask.dueTime
      },

      set (dueTime) {
        this.tempTask.dueTime = dueTime
      }
    },

    due () {
      const dueDate = this.dueDate
      if (!dueDate) {
        return dueDate
      }

      let due = moment(dueDate).tz((this.currentUser && this.currentUser.time_zone) || 'UTC')
      const dueTime = this.dueTime
      if (dueTime) {
        due = due.set({ hour: dueTime.hour, minute: dueTime.minute })
      }

      return due.tz('UTC').toDate()
    },

    account: {
      get () {
        return this.tempTask && this.tempTask.account
      },

      set (account) {
        if (this.tempTask.account) {
          this.tempTask.contact = null
        }
        this.tempTask.account = account
      }
    },

    contact: {
      get () {
        return this.tempTask && this.tempTask.contact
      },

      set (contact) {
        this.tempTask.contact = contact
      }
    },

    assigned_to: {
      get () {
        return (this.tempTask && this.tempTask.assigned_to) ||
                  (this.task && this.task.assigned_to) ||
                  this.currentUser
      },
      set (user) {
        this.tempTask.assigned_to = user
        this.userFilterQuery = ''
      }
    },
    isEditMode () {
      return this.isEdit
    }
  },

  watch: {
    account: function (newAccount, oldAccount) {
      if (!this.isDifferentAccount(this.contact && this.contact.account, oldAccount) &&
        this.isDifferentAccount(newAccount, oldAccount)) {
        this.tempTask.contact = null
      }
      if (newAccount && newAccount.id && this.isDifferentAccount(newAccount, oldAccount)) {
        this.fetchContactsByAccount(newAccount.id)
      } else {
        this.getContacts()
      }
    },
    contact: function (newContact, oldContact) {
      if (newContact && ((newContact.account && newContact.account.id) !==
        (oldContact && oldContact.account && oldContact.account.id))) {
        this.tempTask.account = newContact.account
      }
    }
  },

  beforeMount () {
    if (this.task && this.task.contact) {
      this.contact = this.task.contact
    } else if (this.stateContact) {
      this.contact = this.stateContact
    }
    if (this.task && this.task.account) {
      this.account = this.task.account
    } else if (this.stateAccount) {
      this.account = this.stateAccount
    }
    this.getAccounts(this.account && this.account.name)
    this.fetchUsers()
    this.filterUsers('')
  },

  methods: {
    ...mapActions([
      'clearNoteTasks',
      'createTask',
      'fetchTasksByAccount',
      'fetchTasksByContact',
      'fetchUsers',
      'filterUsers',
      'getTasks',
      'nextNoteTask',
      'resetCurrentNoteTask',
      'updateTask'
    ]),

    initialData () {
      return {
        accountFilterQuery: this.task.account && this.task.account.name,
        contactFilterQuery: this.task.contact && this.task.contact.full_name,

        taskDueDate: null,
        taskDueTime: null,

        selectedUser: null,

        tempTask: {
          description: null,
          category: null,
          priority: false,
          due: null,
          dueDate: '',
          dueTime: null,
          account: null,
          contact: null,
          assigned_to: null,
          note_ids: []
        },

        dueTimes: [
          { name: '8:00 AM', hour: 8, minute: 0 },
          { name: '8:30 AM', hour: 8, minute: 30 },
          { name: '9:00 AM', hour: 9, minute: 0 },
          { name: '9:30 AM', hour: 9, minute: 30 },
          { name: '10:00 AM', hour: 10, minute: 0 },
          { name: '10:30 AM', hour: 10, minute: 30 },
          { name: '11:00 AM', hour: 11, minute: 0 },
          { name: '11:30 AM', hour: 11, minute: 30 },
          { name: '12:00 PM', hour: 12, minute: 0 },
          { name: '12:30 PM', hour: 12, minute: 30 },
          { name: '1:00 PM', hour: 13, minute: 0 },
          { name: '1:30 PM', hour: 13, minute: 30 },
          { name: '2:00 PM', hour: 14, minute: 0 },
          { name: '2:30 PM', hour: 14, minute: 30 },
          { name: '3:00 PM', hour: 15, minute: 0 },
          { name: '3:30 PM', hour: 15, minute: 30 },
          { name: '4:00 PM', hour: 16, minute: 0 },
          { name: '4:30 PM', hour: 16, minute: 30 },
          { name: '5:00 PM', hour: 17, minute: 0 },
          { name: '5:30 PM', hour: 17, minute: 30 },
          { name: '6:00 PM', hour: 18, minute: 0 },
          { name: '6:30 PM', hour: 18, minute: 30 },
          { name: '7:00 PM', hour: 19, minute: 0 },
          { name: '7:30 PM', hour: 19, minute: 30 },
          { name: '8:00 PM', hour: 20, minute: 0 },
          { name: '8:30 PM', hour: 20, minute: 30 },
          { name: '9:00 PM', hour: 21, minute: 0 },
          { name: '9:30 PM', hour: 21, minute: 30 },
          { name: '10:00 PM', hour: 22, minute: 0 },
          { name: '10:30 PM', hour: 22, minute: 30 },
          { name: '11:00 PM', hour: 23, minute: 0 },
          { name: '11:30 PM', hour: 23, minute: 30 },
          { name: '12:00 AM', hour: 0, minute: 0 },
          { name: '12:30 AM', hour: 0, minute: 30 },
          { name: '1:00 AM', hour: 1, minute: 0 },
          { name: '1:30 AM', hour: 1, minute: 30 },
          { name: '2:00 AM', hour: 2, minute: 0 },
          { name: '2:30 AM', hour: 2, minute: 30 },
          { name: '3:00 AM', hour: 3, minute: 0 },
          { name: '3:30 AM', hour: 3, minute: 30 },
          { name: '4:00 AM', hour: 4, minute: 0 },
          { name: '4:30 AM', hour: 4, minute: 30 },
          { name: '5:00 AM', hour: 5, minute: 0 },
          { name: '5:30 AM', hour: 5, minute: 30 },
          { name: '6:00 AM', hour: 6, minute: 0 },
          { name: '6:30 AM', hour: 6, minute: 30 },
          { name: '7:00 AM', hour: 7, minute: 0 },
          { name: '7:30 AM', hour: 7, minute: 30 }
        ],
        contacts: [],
        accounts: []
      }
    },

    isDifferentAccount (newAccount, oldAccount) {
      return (newAccount && newAccount.id) !== (oldAccount && oldAccount.id)
    },

    saveTask () {
      this.$validator.validateAll().then((result) => {
        if (!result) return

        const task = {
          task: {
            description: this.description,
            category: this.type,
            priority: this.priority,
            due: this.due,
            account_id: this.account && this.account.id,
            assigned_to_id: this.assigned_to && this.assigned_to.id,
            note_ids: this.task.note_ids
          }
        }

        if (this.contact && this.contact.id) {
          task.task.contact_task_attributes = {
            contact_id: this.contact && this.contact.id
          }
        }

        if (this.isEditMode) {
          this.updateTask({
            id: this.task.id,
            data: task
          })
            .then(() => {
              MisoMessage.success('Successfully updated the task')
              this.onHideSidePanel()
              this.fetchTasks(1)
            })
            .catch(() => MisoMessage.error('Failed to update the task'))
        } else {
          // Set the creation user id
          task.task.created_by_id = this.currentUser.id
          Object.assign(this.$data, this.initialData())
          this.createTask({ data: task })
            .then(() => {
              MisoMessage.success('Successfully created new task')
              this.nextNoteTask()
              if (!this.isThereNextTask) {
                this.clearNoteTasks()
                this.resetCurrentNoteTask()
                this.onHideSidePanel()
              }
              this.fetchTasks(1)
            })
            .catch((err) => {
              MisoMessage.error('Failed to create new task')
              console.error(err)
            })
        }
      })
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
      } else if (this.account && this.account.id) {
        this.fetchContactsByAccount(this.account.id)
      } else {
        this.getContacts(query)
      }
    },

    setUserFilterQuery (query) {
      this.filterUsers(query)
    },

    fetchTasks (page) {
      if (this.stateContact) {
        this.fetchTasksByContact({page: page, id: this.stateContact.id})
      } else if (this.stateAccount) {
        this.fetchTasksByAccount({page: page, id: this.stateAccount.id})
      } else {
        this.getTasks(page)
      }
    }
  }
}
</script>

<style lang="scss">
  .miso-custom-input {
    & .el-textarea__inner {
      border-color: #eaeaec;
    }

    & > .el-textarea__inner:focus {
      border-color: #6957da
    }
  }

  .tasks-form {
    &__footer,
    &__heading {
      width: 310px;
      background-color: #fff;
    }

    &__heading {
      padding: 30px 0 22px;
    }

    &__form {
      margin: 90px 0 68px;

      .el-form-item:last-child {
        margin-bottom: 1px;
      }
    }

    .el-textarea__inner {
      padding: 9px 13px;
    }

    &__footer {
      padding-top: 27px;
    }
  }
</style>
