<template>
  <div
    :class="{'quill-focused shadow-1': focused}"
    class="quill-wrapper bg-white">

    <miso-popover
      ref="tasks"
      v-model="isTasksPopoverVisible"
      width="250"
      transition="">
      <div class="bg-off-white bb b--light-gray-accent mid-gray-accent pa2 flex items-center justify-between">
        <span class="f6">Insert tasks</span>
        <miso-button
          type="transparent"
          size="small"
          @click="isTasksPopoverVisible = false">
          <feather-icon
            name="x"
            height="16"
            width="16"
            color="mid-gray"/>
        </miso-button>
      </div>

      <div>
        <ul class="list pl0 mv0">
          <li
            v-if="isJustworks"
            class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
            @click="addNoteTask('email')">
            <feather-icon
              name="mail"
              width="16"
              height="16"
              color="purple"/>
            <span class="ml3">Email Task</span>
          </li>
          <li
            class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
            @click="addNoteTask('call')">
            <feather-icon
              name="file"
              width="16"
              height="16"
              color="purple"/>
            <span class="ml3">Call / Note Task</span>
          </li>
          <li
            class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
            @click="addNoteTask('to_do')">
            <feather-icon
              name="check"
              width="16"
              height="16"
              color="purple"/>
            <span class="ml3">To-Do Task</span>
          </li>
        </ul>
      </div>
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

      <div>
        <ul class="list pl0 mv0">
          <li
            v-for="template in noteTemplates"
            :key="template.name"
            class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
            @click="insertNoteTemplate(template)">
            <span class="ml3">{{ template.name }}</span>
          </li>
        </ul>
      </div>
    </miso-popover>

    <miso-popover
      ref="fields"
      v-model="isFieldsPopoverVisible"
      width="250"
      transition="">
      <div class="bg-off-white bb b--light-gray-accent mid-gray-accent pa2 flex items-center justify-between">
        <span class="f6">Note Fields</span>
        <miso-button
          type="transparent"
          size="small"
          @click="isFieldsPopoverVisible = false">
          <feather-icon
            name="x"
            height="16"
            width="16"
            color="mid-gray"/>
        </miso-button>
      </div>

      <miso-tabs
        v-model="fieldsActiveTab"
        class="w-100">

        <miso-tab-pane
          label="Contact"
          name="contact"
          class="popover-tab">
          <ul class="list pl0 mv0">
            <li
              v-for="field in contactFields"
              :key="field.key"
              class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
              @click="addNoteField(field)">
              {{ field.label }}
            </li>
          </ul>
        </miso-tab-pane>

        <miso-tab-pane
          label="Account"
          name="account"
          class="popover-tab">
          <ul class="list pl0 mv0">
            <li
              v-for="field in accountFields"
              :key="field.key"
              class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
              @click="addNoteField(field)">
              {{ field.label }}
            </li>
          </ul>
        </miso-tab-pane>

      </miso-tabs>

    </miso-popover>

    <div id="toolbar">
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

      <span>
        <el-tooltip
          :open-delay="300"
          :enterable="false"
          effect="dark"
          content="Fields"
          placement="bottom">
          <button
            v-popover:fields
            class="f6 dark-gray-accent"
            @click.prevent>
            <feather-icon
              name="upload-cloud"
              height="16"
              width="16"
              color="color-inherit"/>
          </button>
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
          content="Tasks"
          placement="bottom">
          <button
            v-popover:tasks
            class="f6 dark-gray-accent"
            @click.prevent>
            <feather-icon
              name="check-square"
              height="16"
              width="16"
              color="color-inherit"/>
          </button>
        </el-tooltip>
      </span>

    </div>

    <quill-editor
      v-validate:bodyText="'required'"
      ref="noteComposer"
      :content="content"
      :options="options"
      :style="editorStyle"
      class="relative"
      data-vv-name="body"
      data-cy="description"
      @blur="onEditorBlur($event)"
      @change="onEditorChange($event)"
      @focus="onEditorFocus($event)"/>

  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

import { mapGetters, mapMutations } from 'vuex'

import {
  MisoButton,
  MisoPopover,
  FeatherIcon,
  MisoTabs,
  MisoTabPane,
  MisoMessage
} from 'miso'

import { Tooltip } from 'element-ui'
import _ from 'lodash'

import NotesFormComposeTasks from '#/components/notes/notes-form-compose-tasks'

export default {
  name: 'NotesFormCompose',

  components: {
    quillEditor,
    MisoButton,
    MisoPopover,
    FeatherIcon,
    MisoTabs,
    MisoTabPane,
    MisoMessage,
    'el-tooltip': Tooltip,

    NotesFormComposeTasks
  },

  props: {
    onAddNoteTask: {
      type: Function,
      default () {}
    },
    onShowInsertTemplateModal: {
      type: Function,
      default () {}
    },
    onInsertTemplate: {
      type: Function,
      default () {}
    },
    isInsertTemplateConfirmed: {
      type: Boolean,
      default: false
    },
    onAddNoteField: {
      type: Function,
      default () {}
    },
    accountFields: {
      type: Array,
      default: () => []
    },
    contactFields: {
      type: Array,
      default: () => []
    },
    onChange: {
      type: Function,
      default () {}
    },
    content: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      bodyText: '',
      focused: false,
      options: {
        modules: {
          toolbar: '#toolbar'
        },
        placeholder: 'Take your notes…'
      },
      isTasksPopoverVisible: false,
      isFieldsPopoverVisible: false,
      isTemplatesPopoverVisible: false,
      fieldsActiveTab: 'contact'
    }
  },

  inject: {
    $validator: '$validator'
  },

  computed: {
    ...mapGetters(['noteTemplates', 'isJustworks']),

    editor () {
      return this.$refs.noteComposer.quill
    },

    editorStyle () {
      const height = this.height || 350

      return {
        height: `${height}px`
      }
    },

    editorPlain () {
      return _.trim(this.editor.getText())
    },

    editorDelta () {
      return this.editor.getContents()
    }
  },

  mounted () {
    this.bodyText = this.editorPlain
  },

  methods: {
    ...mapMutations(['setNoteFields']),

    onEditorBlur (quill) {
      this.focused = false
    },

    onEditorFocus (quill) {
      this.focused = true
    },

    onEditorChange ({ quill, html, text }) {
      if (_.trim(text) === '') {
        this.bodyText = null
        this.$emit('input', {content_html: null, content_plain: null})
      } else {
        this.bodyText = _.trim(text)
        this.$emit('input', {content_html: html, content_plain: text})
      }
    },

    addNoteTask (task) {
      this.isTasksPopoverVisible = false
      this.onAddNoteTask(task)
    },

    addNoteField (field) {
      this.isFieldsPopoverVisible = false
      this.onAddNoteField(field)
    },

    insertNoteTemplate (template) {
      this.isTemplatesPopoverVisible = false
      this.onShowInsertTemplateModal(template)
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

    button.ql-custom {
      width: auto;

      &:hover {
        color: var(--purple);
      }

    }

    .ql-toolbar {
      border-bottom: 0;
      border-top-left-radius: .25rem;
      border-top-right-radius: .25rem;

      button:hover .ql-picker-item .ql-stroke,
      button:focus .ql-picker-item .ql-stroke {
        stroke: #4E4E56;
      }

      .ql-picker-label:hover,
      .ql-picker-label.ql-active,
      button.ql-active,
      button:hover,
      button:focus {
        color: var(--purple);

        .ql-fill {
          fill: var(--purple);
        }

        .ql-stroke {
          stroke: var(--purple);
        }

        .ql-expanded .ql-picker-label .ql-stroke {
          stroke: #ccc;
        }

        .ql-picker-item .ql-stroke {
          stroke: #4E4E56;
        }
      }
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

    &.quill-focused {
      .ql-toolbar,
      .ql-container {
        border-color: var(--purple);
      }
    }
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

  .ql-picker-item:hover .ql-stroke,
  .ql-picker-item:focus .ql-stroke {
    color: var(--purple);
    stroke: var(--purple) !important;
  }

  .notes-form .quill-editor {
    height: calc(100vh - 407px);
  }

  .popover-tab {
    max-height: 200px;
    overflow-y: auto;
  }
</style>

<style lang="scss" scoped>
  .alignment {
    padding: 0 !important;
  }
</style>
