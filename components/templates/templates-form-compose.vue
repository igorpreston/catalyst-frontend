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
            class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
            @click="addTemplateTask('email')">
            <feather-icon
              name="mail"
              width="16"
              height="16"
              color="purple"/>
            <span class="ml3">Email Task</span>
          </li>
          <li
            class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
            @click="addTemplateTask('call')">
            <feather-icon
              name="file"
              width="16"
              height="16"
              color="purple"/>
            <span class="ml3">Call / Note Task</span>
          </li>
          <li
            class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
            @click="addTemplateTask('to_do')">
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
      ref="fields"
      v-model="isFieldsPopoverVisible"
      width="250"
      transition="">
      <div class="bg-off-white bb b--light-gray-accent mid-gray-accent pa2 flex items-center justify-between">
        <span class="f6">Template Fields</span>
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
          name="contact">
          <ul class="list pl0 mv0">
            <li
              v-for="field in contactFields"
              :key="field.name"
              class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
              @click="addTemplateField(field)">
              {{ field.name }}
            </li>
          </ul>
        </miso-tab-pane>

        <miso-tab-pane
          label="Account"
          name="account">
          <ul class="list pl0 mv0">
            <li
              v-for="field in accountFields"
              :key="field.name"
              class="pa2 db mv1 f6 hover-bg-off-white br2 flex"
              @click="addTemplateField(field)">
              {{ field.name }}
            </li>
          </ul>
        </miso-tab-pane>

      </miso-tabs>

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
    </div>

    <quill-editor
      ref="templatesCompose"
      :options="options"
      v-model="editorContent"
      class="relative"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"/>

  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'
import { Tooltip } from 'element-ui'

import {
  FeatherIcon,
  MisoBadge,
  MisoButton,
  MisoPopover,
  MisoTabs,
  MisoTabPane
} from 'miso'

const Block = Quill.import('blots/block')

Block.tagName = 'div'
Quill.register(Block, true)

export default {
  name: 'TemplatesFormCompose',

  components: {
    FeatherIcon,
    MisoBadge,
    MisoButton,
    MisoPopover,
    MisoTabs,
    MisoTabPane,
    quillEditor,
    'el-tooltip': Tooltip
  },

  props: [
    'templateContentPlain',
    'templateContentHtml',
    'onAddTemplateTask',
    'onAddTemplateField',
    'accountFields',
    'contactFields'
  ],

  data () {
    return {
      focused: false,
      contentPlain: '',
      contentHtml: '',
      options: {
        modules: {
          toolbar: '#toolbar'
        },
        placeholder: 'Say anything...'
      },
      isTasksPopoverVisible: false,
      isFieldsPopoverVisible: false,
      fieldsActiveTab: 'contact'
    }
  },

  computed: {
    editor () {
      return this.$refs.templatesCompose.quill
    },

    editorContent: {
      get () {
        if (this.contentHtml && this.contentHtml.length > 0) {
          return this.contentHtml
        }

        return this.templateContentHtml
      },

      set (content) {
        this.contentHtml = content
        this.$emit('input', content)
      }
    },

    editorPlain () {
      return this.editor.getText()
    },

    editorDelta () {
      return this.editor.getContents()
    }
  },

  methods: {
    onEditorBlur (quill) {
      this.focused = false
    },

    onEditorFocus (quill) {
      this.focused = true
    },

    onEditorReady (quill) {

    },

    onEditorChange ({ quill, html, text }) {
      this.contentHtml = html
      this.contentPlain = text
    },

    addTemplateTask (task) {
      this.isTasksPopoverVisible = false
      this.onAddTemplateTask(task)
    },

    addTemplateField (field) {
      this.isFieldsPopoverVisible = false
      this.onAddTemplateField(field)
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

      button:hover .ql-picker-item .ql-stroke,
      button:focus .ql-picker-item .ql-stroke {
        stroke: #444;
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
          stroke: #444;
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

  .ql-picker-item:hover .ql-stroke,
  .ql-picker-item:focus .ql-stroke {
    color: var(--purple);
    stroke: var(--purple) !important;
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

  .templates-form .quill-editor {
    height: calc(100vh - 392px);
  }
</style>

<style lang="scss" scoped>
  .alignment {
    padding: 0 !important;
  }
</style>
