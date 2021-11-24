<template>
  <section class="invoice-add-wrapper">
    <!-- Alert: No item found -->
    <b-alert
      variant="danger"
      :show="noteData === undefined"
    >
      <h4 class="alert-heading">
        Error fetching notes data
      </h4>
      <div class="alert-body">
        No notes found with this note id. Check
        <b-link
          class="alert-link"
          :to="{ name: 'apps-notes-list'}"
        >
          Notes List
        </b-link>
        for other notes.
      </div>
    </b-alert>

    <b-row
      v-if="noteData"
      class="invoice-add"
    >

      <!-- Col: Left (Invoice Container) -->
      <b-col
        cols="12"
        xl="9"
        md="8"
      >
        <b-form @submit.prevent>
          <b-card
            no-body
            class="invoice-preview-card"
          >
            <!-- Header -->
            <b-card-body class="invoice-padding pb-0">

              <div class="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">

                <!-- Header: Left Content -->
                <div>
                  <div class="logo-wrapper">
                    <h3 class="text-primary invoice-logo">
                      Edit note
                    </h3>
                  </div>
                </div>

                <!-- Header: Right Content -->
                <div class="invoice-number-date mt-md-0 mt-2">
                  <div class="d-flex align-items-center justify-content-md-end mb-1">
                    <h4 class="invoice-title">
                      Note
                    </h4>
                    <b-input-group class="input-group-merge invoice-edit-input-group disabled">
                      <b-input-group-prepend is-text>
                        <feather-icon icon="HashIcon" />
                      </b-input-group-prepend>
                      <b-form-input
                        id="invoice-data-id"
                        v-model="noteData.id"
                        disabled
                      />
                    </b-input-group>
                  </div>
<!--
                  <div class="d-flex align-items-center mb-1">
                    <span class="title">
                      Date:
                    </span>
                    <flat-pickr
                      v-model="noteData.issuedDate"
                      class="form-control invoice-edit-input"
                    />
                  </div>
                  <div class="d-flex align-items-center">
                    <span class="title">
                      Due Date:
                    </span>
                    <flat-pickr
                      v-model="noteData.dueDate"
                      class="form-control invoice-edit-input"
                    />
                  </div>
-->
                </div>
              </div>
            </b-card-body>

            <!-- Spacer -->
            <hr class="invoice-spacing">

            <!-- Invoice Client & Payment Details -->
            <b-card-body
              class="invoice-padding pt-0"
            >
              <b-row class="invoice-spacing">
                <b-col
                  cols="12"
                  xl="12"
                  class="mb-lg-1"
                >
                    <span class="title">
                      Note title:
                    </span>

                  <b-card-text class="mb-25">
                      <b-form-input
                        id="note-title"
                        v-model="noteData.title"
                      />
                  </b-card-text>
                </b-col>
              </b-row>


              <b-row class="invoice-spacing">


                <!-- Col: Invoice To -->
                <b-col
                  cols="12"
                  xl="12"
                  class="mb-lg-1"
                >
                <span class="title">
                  Note body:
                </span>

                <quill-editor
                  v-model="noteData.note"
                  :options="editorOption"
                />

                </b-col>
              </b-row>

              <hr class="invoice-spacing">

              <b-row class="invoice-spacing">

                <div class="d-flex justify-content-between align-items-center">
                  <label for="shareNote" class="title mr-1">Share this note</label>
                  <b-form-checkbox
                    id="shareNote"
                    v-model="noteData.shared"
                    switch
                  />
                </div>
              </b-row>
              <b-row 
                v-if="noteData.shared" 
                class="invoice-spacing">
                <div >
                
                  <b-card-text class="mb-25" v-if='!isHashed(this.noteData.share_password)'>
                      Sharing password:
                      <b-form-input
                        v-model="noteData.share_password"
                        autocomplete="off"
                      />
                  </b-card-text>
                  <b-card-text class="mb-25" v-if='isHashed(this.noteData.share_password)'>
                  <b-button
                    @click="clearPassword()"
                  >
                  Reset password
                  </b-button>
                  </b-card-text>
                  <b-card-text class="mb-25">
                  Sharing link will be generated after note saved.
                  </b-card-text>
                </div>
              </b-row>

            </b-card-body>
          </b-card>
        </b-form>
      </b-col>

      <!-- Right Col: Card -->
      <b-col
        cols="12"
        md="4"
        xl="3"
        class="invoice-actions"
      >

        <!-- Action Buttons -->
        <b-card>

          <!-- Button: Send Invoice -->
          <b-button
            v-ripple.400="'rgba(255, 255, 255, 0.15)'"
            variant="primary"
            class="mb-75"
            block
            @click="saveNote()"
          >
            Save Note
          </b-button>

          <b-button
            v-ripple.400="'rgba(113, 102, 240, 0.15)'"
            variant="outline-primary"
            class="mb-75"
            block
            :to="{ name: 'apps-notes'}"
          >
            Cancel
          </b-button>


        </b-card>

      </b-col>
    </b-row>

    
  </section>
</template>

<script>
import Logo from '../Logo.vue'
import { ref, onUnmounted } from '@vue/composition-api'
import { heightTransition } from '@core/mixins/ui/transition'
import Ripple from 'vue-ripple-directive'
import store from '@/store'
import router from '@/router'
import {
  BRow, BCol, BCard, BCardBody, BButton, BCardText, BForm, BFormGroup, BFormInput, BInputGroup, BInputGroupPrepend, BFormTextarea, BFormCheckbox, BPopover, BAlert, BLink, VBToggle,
} from 'bootstrap-vue'
import BCardCode from '@core/components/b-card-code/BCardCode.vue'
import { quillEditor } from 'vue-quill-editor'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import notesStoreModule from '../notesStoreModule'
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default {
  components: {
    BRow,
    BCol,
    BCard,
    BCardBody,
    BButton,
    BCardCode,
    BCardText,
    BForm,
    BFormGroup,
    BFormInput,
    BInputGroup,
    BInputGroupPrepend,
    BFormTextarea,
    BFormCheckbox,
    BPopover,
    BAlert,
    BLink,
    quillEditor,
    flatPickr,
    vSelect,
    Logo,
    // InvoiceSidebarSendInvoice,
    // InvoiceSidebarAddPayment,
  },
  data() {
    return {
      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1'}, { 'indent': '+1' }], 
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean']   
          ],
        }
      },

    }
  },
  directives: {
    Ripple,
    'b-toggle': VBToggle,
  },
  mixins: [heightTransition],

  // Reset Tr Height if data changes
  watch: {
    // eslint-disable-next-line func-names
    'invoiceData.items': function () {
      this.initTrHeight()
    },
  },
  mounted() {
    
    this.initTrHeight()
  },
  created() {
    window.addEventListener('resize', this.initTrHeight)
  },
  destroyed() {
    window.removeEventListener('resize', this.initTrHeight)
  },
  methods: {
    clearPassword() {
      this.noteData.share_password = '' 
    },
    isHashed(password) {
      return password.length > 15
    },
    saveNote() {
      if (!this.noteData.shared) { 
        this.noteData.share_password = '' 
      }
      store
        .dispatch('app-notes/updateNote', this.noteData )
        .then(response => {
          router.push({ name: 'apps-notes' })
        })
    },
    initTrHeight() {
      this.trSetHeight(null)
      this.$nextTick(() => {
        this.trSetHeight(this.$refs.form ? this.$refs.form.scrollHeight : 0)
      })
    },
  },
  setup() {

    const NOTES_APP_STORE_MODULE_NAME = 'app-notes'

    // Register module
    if (!store.hasModule(NOTES_APP_STORE_MODULE_NAME)) store.registerModule(NOTES_APP_STORE_MODULE_NAME, notesStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(NOTES_APP_STORE_MODULE_NAME)) store.unregisterModule(NOTES_APP_STORE_MODULE_NAME)
    })

    const noteData = ref(null)

    const toast = useToast()

    store.dispatch('app-notes/fetchNote', { id: router.currentRoute.params.id })
      .then(response => {
        noteData.value = response.data
        noteData.value.shared = noteData.value.shared==1
      })
      .catch(error => {
        if (error.response.status === 404) {
          noteData.value = undefined
        }
      })

    return {
      noteData,
    }
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/libs/quill.scss';
@import '@core/scss/vue/libs/vue-select.scss';
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>

<style lang="scss" scoped>
@import "~@core/scss/base/pages/app-invoice.scss";

.form-item-section {
  background-color:$product-details-bg;
}

.form-item-action-col {
  width: 27px;
}

.repeater-form {
  // overflow: hidden;
  transition: .35s height;
}

.v-select {
  &.item-selector-title,
  &.payment-selector {
    background-color: #fff;

    .dark-layout & {
      background-color: unset;
    }
  }
}

.dark-layout {
  .form-item-section {
    background-color: $theme-dark-body-bg;

    .row .border {
      background-color: $theme-dark-card-bg;
    }

  }
}
</style>
