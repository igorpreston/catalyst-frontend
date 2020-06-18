<template>
  <div
    class="quill-wrapper bg-white"
    :class="{'quill-focused shadow-1': focused}">
    <miso-popover
      class="f5"
      ref="templates"
      v-model="templatePopoverVisible"
      :visible-arrow="false"
      width="250"
      transition="">
      <div class="bg-off-white bb b--light-gray-accent mid-gray-accent pa2 flex items-center justify-between">
        <span class="f6">Templates</span>
        <miso-button
          type="transparent"
          size="small"
          @click="closeTemplatesPopover">
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
      <div
        v-else
        class="pa2">
        <ul class="list pl0 mv0">
          <li
            v-for="(template, index) in availableTemplates"
            :key="index"
            class="db mv1 f5 hover-bg-off-white br2">
            <miso-button
              type="transparent"
              size="tiny"
              class="tl mid-gray-accent hover-purple pv2 w-100"
              @click="insertTemplate(index)">
              <p class="mt0 mb1 m">{{ template.name }}</p>
              <p class="mv0 mid-gray-accent f6">{{ stripHtml(template.content_plain) | truncate(50) }}</p>
            </miso-button>
          </li>
        </ul>
      </div>
    </miso-popover>
    <miso-popover
      ref="tokens"
      v-model="tokenPopoverVisible"
      :visible-arrow="false"
      width="350"
      transition="">
      <div class="bg-off-white bb b--light-gray-accent mid-gray-accent pa2 flex items-center justify-between">
        <span class="f6">Tokens</span>
        <miso-button
          type="transparent"
          size="small"
          @click="closeTokenPopover">
          <feather-icon
            name="x"
            height="16"
            width="16"
            color="mid-gray"/>
        </miso-button>
      </div>
      <miso-tabs v-model="activeTokenPopoverTab">
        <miso-tab-pane
          v-for="(object, index) in tokens"
          :label="object.label"
          :name="object.name"
          :key="index">
          <div class="pa2 bg-off-white">
            <miso-input
              variant="white"
              v-model="filterName"
              class="f6"
              placeholder="Filter tokens by name"/>
          </div>
          <div
            style="height: 250px"
            class="overflow-y-scroll pa2"
            v-if="filter(object.tokens).length > 0">
            <ul class="list pl0 mv0">
              <li
                v-for="(token, tokenIndex) in filter(object.tokens)"
                :key="tokenIndex"
                class="db mv1 f5 hover-bg-off-white br2">
                <miso-button
                  type="transparent"
                  size="tiny"
                  class="mid-gray-accent hover-dark-gray-accent pv2 w-100"
                  @click="insertToken(token.variable)">
                  <div class="flex items-center justify-between">
                    <span class="purple">{{ token.variable }}</span>
                    <span class="f6">{{ token.label }}</span>
                  </div>
                </miso-button>
              </li>
            </ul>
          </div>
          <miso-empty
            class="pv4"
            v-else
            heading="No tokens found"
            body="Search again"/>
        </miso-tab-pane>
      </miso-tabs>
    </miso-popover>
    <div id="toolbar">
      <button class="ql-bold"/>
      <button class="ql-italic"/>
      <button class="ql-underline"/>
      <select
        class="ql-align"
        title="Alignment">
        <option/>
        <option value="center"/>
        <option value="right"/>
        <option value="justify"/>
      </select>
      <button class="ql-link"/>
      <button
        class="ql-list"
        value="ordered"/>
      <button
        class="ql-list"
        value="bullet"/>
      <button class="ql-image"/>
      <button
        v-show="hasTokens"
        class="f6 dark-gray-accent"
        v-popover:tokens>
        <feather-icon
          name="zap"
          color="color-inherit"
          height="16"
          width="16"/>
      </button>
      <button
        class="f6 dark-gray-accent"
        v-popover:templates>
        <feather-icon
          name="copy"
          color="color-inherit"
          height="16"
          width="16"/>
      </button>
    </div>
    <quill-editor
      id="quillInstance"
      class="relative"
      :content="body"
      @change="onEditorChange($event)"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      ref="myQuillEditor"
      :options="editorOptions"/>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import Quill from 'quill'
import { quillEditor } from 'vue-quill-editor'
import { ImageDrop } from 'quill-image-drop-module'
import ImageResize from 'quill-image-resize-module'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)

// Quill newline fix
var Parchment = Quill.import('parchment')
var Block = Parchment.query('block')
Block.tagName = 'DIV'
Quill.register(Block, true)

import axios from 'axios'
import { mapState } from 'vuex'

import Vue2Filters from 'vue2-filters'

import {
  MisoPopover,
  MisoLabel,
  FeatherIcon,
  MisoButton,
  MisoTabs,
  MisoTabPane,
  MisoEmpty,
  MisoInput
} from 'miso'

Vue.use(MisoPopover)
Vue.use(Vue2Filters)

export default {
  name: 'Editor',
  components: {
    quillEditor,
    MisoPopover,
    MisoLabel,
    FeatherIcon,
    MisoButton,
    MisoTabs,
    MisoTabPane,
    MisoEmpty,
    MisoInput
  },
  props: {
    body: String,
    placeholder: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      focused: false,
      templatePopoverVisible: false,
      availableTemplates: [],
      editorOptions: {
        modules: {
          toolbar: '#toolbar',
          imageResize: true,
          imageDrop: true
        },
        placeholder: ''
      },
      tokenPopoverVisible: false,
      activeTokenPopoverTab: '',
      filterName: ''
    }
  },
  watch: {
    hasTokens: function (newVal) {
      if (newVal) {
        this.activeTokenPopoverTab = this.tokens[0].name
      }
    }
  },
  computed: {
    ...mapState('tokens', ['tokens']),
    editor () {
      return this.$refs.myQuillEditor.quill
    },
    hasTokens () {
      return this.tokens.length > 0
    },
    hasTemplates () {
      return this.availableTemplates.length > 0
    }
  },
  beforeMount () {
    this.getTemplates()
    this.editorOptions.placeholder = this.placeholder
    if (this.hasTokens) {
      this.activeTokenPopoverTab = this.tokens[0].name
    }
  },
  methods: {
    closeTemplatesPopover () {
      this.templatePopoverVisible = false
    },
    closeTokenPopover () {
      this.tokenPopoverVisible = false
    },
    insertToken (token) {
      let selection = this.editor.getSelection()
      // Delete the selection to replace selected text with template
      if (selection && selection.length > 0) {
        this.editor.deleteText(selection.index, selection.length)
      }
      let insertIndex = selection === null ? this.editor.getLength() - 1 : selection.index
      this.closeTokenPopover()
      this.editor.insertText(insertIndex, token, 'bold', false)
    },
    insertTemplate (index) {
      let selection = this.editor.getSelection()
      // Delete the selection to replace selected text with template
      if (selection && selection.length > 0) {
        this.editor.deleteText(selection.index, selection.length)
      }
      let insertIndex = selection === null ? this.editor.getLength() - 1 : selection.index
      this.closeTemplatesPopover()
      this.editor.clipboard.dangerouslyPasteHTML(insertIndex, this.availableTemplates[index].body)
    },
    onEditorBlur (e) {
      this.focused = false
    },
    onEditorFocus (e) {
      this.focused = true
    },
    onEditorChange (e) {
      this.$emit('editor-change', e.html)
    },
    getTemplates () {
      axios.get('/templates.json')
        .then((response) => this.availableTemplates = response.data)
        .catch((response) => console.log('get templates.json call failed'))
    },
    stripHtml (body) {
      return body.replace(/<[^>]+>/g, '')
    },
    filter (tokens) {
      if (this.filterName.length) {
        return tokens.filter((t) => _.includes(t.label.toLowerCase(), this.filterName.toLowerCase()))
      } else {
        return tokens
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
      height: 350px;
      font-size: 1rem;
    }
    .ql-toolbar button:hover,
    .ql-toolbar button:focus {
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
</style>
