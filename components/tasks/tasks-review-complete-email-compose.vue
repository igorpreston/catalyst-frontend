<template>
  <div
    :class="{'quill-focused shadow-1': focused}"
    class="quill-wrapper bg-white">

    <miso-popover
      ref="tokens"
      v-model="isTokensPopoverVisible"
      width="250"
      transition="">
      <div class="bg-off-white bb b--light-gray-accent mid-gray-accent pa2 flex items-center justify-between">
        <span class="f6">Tokens</span>
        <miso-button
          type="transparent"
          size="small"
          @click="isTokensPopoverVisible = false">
          <feather-icon
            name="x"
            height="16"
            width="16"
            color="mid-gray"/>
        </miso-button>
      </div>

      <miso-tabs
        v-model="tokensActiveTab"
        class="w-100">

        <miso-tab-pane
          label="Contact"
          name="contact">
          <ul class="list pl0 mv0">
            <li
              v-for="token in contactTokens"
              :key="token.id"
              class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
              @click="insertToken(token)">
              {{ token.name }}
            </li>
          </ul>
        </miso-tab-pane>

        <miso-tab-pane
          label="Account"
          name="account">
          <ul class="list pl0 mv0">
            <li
              v-for="token in accountTokens"
              :key="token.id"
              class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
              @click="insertToken(token)">
              {{ token.name }}
            </li>
          </ul>
        </miso-tab-pane>

      </miso-tabs>

    </miso-popover>

    <miso-popover
      ref="templates"
      v-model="isTemplatesPopoverVisible"
      width="250"
      transition="">
      <div class="bg-off-white bb b--light-gray-accent mid-gray-accent pa2 flex items-center justify-between">
        <span class="f6">Templates</span>
        <miso-button
          type="transparent"
          size="small"
          @click="isTemplatesPopoverVisible = false">
          <feather-icon
            name="x"
            height="16"
            width="16"
            color="mid-gray"/>
        </miso-button>
      </div>
      <miso-empty
        v-if="!hasTemplates"
        class="pv4"
        heading="No available templates"/>
      <div>
        <ul class="list pl0 mv0">
          <li
            v-for="template in emailTemplates"
            :key="template.id"
            class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
            @click="insertEmailTemplate(template)">
            <span class="ml3">{{ template.name }}</span>
          </li>
        </ul>
      </div>
    </miso-popover>

    <div
      id="toolbar"
      class="br2 br--top">
      <el-tooltip
        :open-delay="300"
        :enterable="false"
        effect="dark"
        content="Bold"
        placement="bottom">
        <button class="ql-bold"/>
      </el-tooltip>

      <el-tooltip
        :open-delay="300"
        :enterable="false"
        effect="dark"
        content="Italic"
        placement="bottom">
        <button class="ql-italic"/>
      </el-tooltip>

      <el-tooltip
        :open-delay="300"
        :enterable="false"
        effect="dark"
        content="Underline"
        placement="bottom">
        <button class="ql-underline"/>
      </el-tooltip>

      <el-tooltip
        :open-delay="300"
        :enterable="false"
        effect="dark"
        content="Alignment"
        placement="bottom">
        <button
          type="button"
          class="alignment">
          <select class="ql-align">
            <option/>
            <option value="center"/>
            <option value="right"/>
            <option value="justify"/>
          </select>
        </button>
      </el-tooltip>

      <el-tooltip
        :open-delay="300"
        :enterable="false"
        effect="dark"
        content="Ordered List"
        placement="bottom">
        <button
          class="ql-list"
          value="ordered"/>
      </el-tooltip>

      <el-tooltip
        :open-delay="300"
        :enterable="false"
        effect="dark"
        content="Unordered List"
        placement="bottom">
        <button
          class="ql-list"
          value="bullet"/>
      </el-tooltip>

      <el-tooltip
        v-if="isJustworks"
        :open-delay="300"
        :enterable="false"
        effect="dark"
        content="Templates"
        placement="bottom">
        <button
          v-popover:templates
          class="f6 dark-gray-accent"
          @click.prevent>
          <feather-icon
            name="copy"
            height="16"
            width="16"
            color="color-inherit"/>
        </button>
      </el-tooltip>

      <el-tooltip
        :open-delay="300"
        :enterable="false"
        effect="dark"
        content="Tokens"
        placement="bottom">
        <button
          v-popover:tokens
          class="f6 dark-gray-accent"
          @click.prevent>
          { }
        </button>
      </el-tooltip>
      <el-tooltip
        :open-delay="300"
        :enterable="false"
        effect="dark"
        content="Image"
        placement="bottom">
        <button class="ql-image"/>
      </el-tooltip>
      <el-tooltip
        :open-delay="300"
        :enterable="false"
        effect="dark"
        content="Link"
        placement="bottom">
        <button class="ql-link"/>
      </el-tooltip>
    </div>

    <quill-editor
      v-validate:bodyText="'required'"
      ref="templateComposer"
      :content="bodyHTML || (content && content.html)"
      :options="options"
      :style="editorStyle"
      class="relative"
      data-vv-name="body"
      data-cy="body"
      @blur="onEditorBlur($event)"
      @change="onEditorChange($event)"
      @focus="onEditorFocus($event)"/>
  </div>
</template>

<script>
import Quill from 'quill'
import _ from 'lodash'

import { mapActions, mapGetters } from 'vuex'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

import {
  FeatherIcon,
  MisoButton,
  MisoEmpty,
  MisoPopover,
  MisoTabs,
  MisoTabPane
} from 'miso'

import { Tooltip } from 'element-ui'

const Block = Quill.import('blots/block')

Block.tagName = 'div'
Quill.register(Block, true)

export default {
  name: 'EmailTemplatesFormCompose',

  components: {
    FeatherIcon,
    MisoButton,
    MisoEmpty,
    MisoPopover,
    MisoTabs,
    MisoTabPane,
    quillEditor,
    'el-tooltip': Tooltip
  },

  props: {
    accountTokens: {
      type: Array,
      default: () => []
    },
    contactTokens: {
      type: Array,
      default: () => []
    },
    validationRule: {
      type: String,
      default: null
    },
    content: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      bodyText: '',
      bodyHTML: '',
      focused: false,
      options: {
        modules: {
          toolbar: {
            container: '#toolbar'
          }
        },
        placeholder: 'The beginning of a great email…'
      },
      isTokensPopoverVisible: false,
      isTemplatesPopoverVisible: false,
      tokensActiveTab: 'contact'
    }
  },

  inject: {
    $validator: '$validator'
  },

  computed: {
    ...mapGetters(['emailTemplates', 'isJustworks']),

    editor () {
      return this.$refs.templateComposer.quill
    },

    editorStyle () {
      const height = this.height || 350

      return {
        height: `${height}px`
      }
    },

    hasTemplates () {
      return this.emailTemplates.length > 0
    },

    editorPlain () {
      return _.trim(this.editor.getText())
    },

    editorDelta () {
      return this.editor.getContents()
    }
  },

  methods: {
    ...mapActions([
      'addTemplateToken',
      'removeTemplateToken'
    ]),

    onEditorBlur (quill) {
      this.focused = false
    },

    onEditorFocus (quill) {
      this.focused = true
    },

    onEditorChange ({ quill, html, text }) {
      // this.setData('text_plain', text)
      this.bodyText = _.trim(text)
      this.bodyHTML = html
      this.$emit('input', {html: html, text: text})
    },

    insertToken (token) {
      const range = this.editor.getSelection(true)
      const index = range.index

      this.editor.insertText(index, token.value)
      this.isTokensPopoverVisible = false
    },

    insertEmailTemplate (token) {
      this.isTemplatesPopoverVisible = false

      if (_.isEmpty(_.trim(this.$parent.subject))) {
        // this.setData('subject', token && token.name)
        this.$emit('input', {subject: token && token.name})
      }
      console.log('token', token)
      const tokenHtml = token && token.content_html
      const tokenPlain = token && token.content_plain

      if (this.content && this.content.text) {
        this.bodyText = _.trim(this.bodyText.concat(this.content.text))
        this.bodyHTML = this.bodyHTML.concat(this.content.html)
        this.$emit('input', {
          html: tokenHtml.concat(this.content.html),
          text: tokenPlain.concat(this.content.text)
        })
      } else {
        this.bodyText = _.trim(this.bodyText.concat(tokenPlain))
        this.bodyHTML = this.bodyHTML.concat(tokenHtml)
        this.$emit('input', {
          html: tokenHtml,
          text: tokenPlain
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .ql-align-right {
    text-align: right;
  }

  .ql-align-center {
    text-align: center;
  }

  .quill-wrapper {

    img.ql-embed-selected {
      border: 1px dashed var(--purple);
      cursor: inherit;
    }

    .ql-resizing {
      position: relative;

      &:before {
        background: black;
        content: attr(data-size);
        color: white;
        position: absolute;
        font-size: .875rem;
        padding: .25rem;
        top: 0;
      }

      &.ql-align-right {
        right: 0;
      }

      &.ql-align-center {
        left: 0;
        right: 0;
        margin: auto;
      }

    }

    .ql-editor {
      height: 100%;
      font-size: 1rem;
    }

    .ql-toolbar button:hover,
    .ql-toolbar button:focus, {
      color: var(--purple);
    }

    button.ql-custom {
      width: auto;

      &:hover {
        color: var(--purple);
      }

    }

    .ql-toolbar {
      border-bottom: 0;
    }

    .ql-toolbar,
    .ql-container {
      border-color: var(--light-gray);
      font-family: 'Circular Std';
      transition: all .2s ease-out;
    }

    .ql-container {
      border-bottom-left-radius: .25rem;
      border-bottom-right-radius: .25rem;
    }

    .ql-toolbar button:hover,
    .ql-toolbar button.ql-active {
      .ql-fill {
        fill: var(--purple);
      }

      .ql-stroke {
        stroke: var(--purple);
      }
    }

    &.quill-focused {
      .ql-toolbar,
      .ql-container {
        border-color: var(--purple);
      }
    }
  }

  .ql-picker-label:hover {
    color: var(--purple);
  }

  .ql-snow .ql-tooltip {
    border-color: #eaeaec;
    z-index: 2;

    &::before {
      font-size: 12px;
      font-weight: 500;
      line-height: 15px;
      color: var(--mid-gray);
      text-transform: uppercase;
      letter-spacing: .25pt;
    }

    input[type=text] {
      padding: .5rem;
      border-radius: .25rem;

      &:focus  {
        border-color: var(--purple);
        box-shadow: inset 0 1px 2px rgba(207, 215, 230, 0.2), 0 0 4px rgba(121, 88, 159, 0.3);
      }
    }

    a {
      color: var(--purple);
      transition: color .15s ease-in;

      &:hover {
        color: var(--purple-subdued);
      }
    }
  }

  .email-form .quill-editor {
    height: calc(100vh - 407px);
  }

  .ql-snow.ql-toolbar .ql-picker-label:hover .ql-stroke,
  .ql-picker-label:hover {
    color: var(--purple);
    stroke: var(--purple);
  }
</style>

<style lang="scss" scoped>
  .alignment {
    padding: 0 !important;
  }
</style>
