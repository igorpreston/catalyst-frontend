<template>
  <div class="flex-auto flex flex-column justify-between">
    <div class="flex-auto overflow-y-auto pv3 ph3">

      <div
        v-if="task.is_completed"
        class="mb3 mt2">
        <p class="b f5">{{ subject }}</p>
        <p class="db mb4"><span class="b">To: </span>{{ recipientName }} &lt; {{ recipientEmail }} &gt; </p>
        <div v-html="text_html"/>
      </div>

      <div
        v-if="!task.is_completed"
        class="mb3 mt2">

        <miso-label class="db mb2 mid-gray">To</miso-label>
        <p><miso-badge
          v-show="errors.has('contact')"
          size="tiny"
          color="red">
          {{ errors.first('contact') }}
        </miso-badge></p>
        <p v-if="hasRecipient">{{ recipientName }} &lt; {{ recipientEmail }} &gt; </p>
        <miso-select
          v-validate.disable="'required'"
          :disabled="hasRecipient"
          v-model="recipient"
          class="white-select w-100 f6"
          data-vv-name="contact"
          clearable
          filterable
          placeholder="Search by contact name"
          value-key="id">

          <miso-option
            v-for="contact in contacts.all"
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
      </div>

      <div
        v-if="!task.is_completed"
        class="mb3">
        <miso-label class="db mb2 mid-gray">Subject</miso-label>
        <p><miso-badge
          v-show="errors.has('subject')"
          size="tiny"
          color="red">
          {{ errors.first('subject') }}
        </miso-badge></p>
        <miso-input
          v-validate.disable="'required'"
          v-model="emailData.subject"
          data-vv-name="subject"
          placeholder="Enter subject"
          variant="white"/>
      </div>

      <p><miso-badge
        v-show="errors.has('body')"
        size="tiny"
        color="red">
        {{ errors.first('body') }}
      </miso-badge></p>
      <tasks-review-complete-email-compose
        v-if="!task.is_completed"
        :account-tokens="accountTokens"
        :contact-tokens="contactTokens"
        :height="350"
        :subject-value="subject"
        v-model="emailData.content"/>
    </div>
    <footer
      v-if="!task.is_completed"
      class="bt b--purple-gray tr pv3 ph3 form__footer w-100 absolute bottom-0">
      <miso-button
        type="primary"
        @click="complete">Send</miso-button>
    </footer>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState, mapActions } from 'vuex'

import {
  CircleBadge,
  MisoButton,
  MisoBadge,
  MisoInput,
  MisoLabel,
  MisoMessage,
  MisoOption,
  MisoSelect
} from 'miso'

import TasksReviewCompleteEmailCompose from '#/components/tasks/tasks-review-complete-email-compose'

export default {
  name: 'TasksReviewCompleteEmail',

  components: {
    CircleBadge,
    MisoButton,
    MisoBadge,
    MisoInput,
    MisoLabel,
    MisoMessage,
    MisoOption,
    MisoSelect,
    TasksReviewCompleteEmailCompose
  },

  data () {
    return this.initialData()
  },

  computed: {
    ...mapState({
      contact: state => state.contacts.contact,
      contacts: state => state.contacts,
      form: state => state.tasks.forms['email'],
      task: state => state.tasks.task
    }),

    recipient: {
      get () {
        return this.emailData.recipient
      },
      set (recipient) {
        this.emailData.recipient = recipient
      }
    },

    subject: {
      get () {
        return this.emailData.subject
      },
      set (subject) {
        this.emailData.subject = subject
      }
    },

    text_html () {
      return this.emailData.content && this.emailData.content.html
    },

    text_plain () {
      return this.emailData.content && _.trim(this.emailData.content.text)
    },

    accountTokens () {
      return this.availableEmailTokens &&
               this.availableEmailTokens.account
    },

    contactTokens () {
      return this.availableEmailTokens &&
          this.availableEmailTokens.contact
    },

    hasRecipient () {
      return !_.isEmpty(this.task.email && this.task.email.contact)
    },

    recipientName () {
      return this.emailData.recipient && this.emailData.recipient.full_name
    },

    recipientEmail () {
      return this.emailData.recipient && this.emailData.recipient.email
    }
  },

  watch: {
    task: function () {
      this.initializeData()
    }
  },

  created () {
    this.initializeData()
  },

  methods: {
    ...mapActions(['completeEmailTask']),

    complete () {
      this.$validator.validateAll().then((result) => {
        if (!result) return
        const emailForm = {
          subject: this.emailData.subject,
          text_html: this.emailData.content.html,
          recipient: this.emailData.recipient.id
        }

        this.completeEmailTask(emailForm)
          .then(() => MisoMessage.success('Successfully completed the task'))
          .catch(() => MisoMessage.error('Failed to complete the task'))
      })
    },

    initializeData () {
      Object.assign(this.$data, this.initialData())
      if (this.task && this.task.email) {
        this.emailData.subject = this.task.email.subject
        this.emailData.content.html = this.task.email.body
      }
      const emailContact = this.task && this.task.email && this.task.email.contact
      const taskContact = this.task && this.task.contact
      this.recipient = emailContact || taskContact
    },

    initialData () {
      return {
        bodyHtml: null,
        emailData: {
          content: {
            html: null,
            text: null
          },
          subject: null,
          recipient: null
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
