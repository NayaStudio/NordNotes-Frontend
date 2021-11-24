<template>

  <!-- Table Container Card -->
  <b-card
    no-body
  >

    <div class="m-2">

      <!-- Table Top -->
      <b-row>

        <!-- Per Page -->
        <b-col
          cols="12"
          md="6"
          class="d-flex align-items-center justify-content-start mb-1 mb-md-0"
        >
          <b-button
            variant="primary"
            :to="{ name: 'apps-notes-add', params: { id : 0 }}"
            class="mr-1"
          >
            Add Note
          </b-button>

          <label>Notes per page</label>
          <v-select
            v-model="perPage"
            :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
            :options="perPageOptions"
            :clearable="false"
            class="per-page-selector d-inline-block ml-50"
          />
        </b-col>

        <!-- Search -->
        <b-col
          cols="12"
          md="6"
        >
        <!--
          <div class="d-flex align-items-center justify-content-end">
            <b-form-input
              v-model="searchQuery"
              class="d-inline-block mr-1"
              placeholder="Search..."
            />
            <v-select
              v-model="statusFilter"
              :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
              :options="statusOptions"
              class="invoice-filter-select"
              placeholder="Select Status"
            >
              <template #selected-option="{ label }">
                <span class="text-truncate overflow-hidden">
                  {{ label }}
                </span>
              </template>
            </v-select>
          </div>
          -->
        </b-col>
      </b-row>

    </div>

    <b-table
      ref="refNotesListTable"
      :items="fetchNotes"
      responsive
      :fields="tableColumns"
      primary-key="id"
      :sort-by.sync="sortBy"
      show-empty
      empty-text="No matching records found"
      :sort-desc.sync="isSortDirDesc"
      class="position-relative"
    >

      <template #head(invoiceStatus)>
        <feather-icon
          icon="TrendingUpIcon"
          class="mx-auto"
        />
      </template>

      <!-- Column: Id -->
      <template #cell(id)="data">
        <b-link
          :to="{ name: 'apps-notes-edit', params: { id: data.item.id }}"
          class="font-weight-bold"
        >
          #{{ data.value }}
        </b-link>
      </template>

      <!-- Column: Invoice Status -->
      <template #cell(shared)="data">
        <b-avatar
          :id="`invoice-row-${data.item.id}`"
          size="32"
          :variant="`light-${resolveSharedVariant(data.item.shared).variant}`"
        >
          <feather-icon
            :icon="resolveSharedVariant(data.item.shared).icon"
          />
        </b-avatar>
<!--
        <b-tooltip
          :target="`invoice-row-${data.item.id}`"
          placement="top"
        >
          <p class="mb-0">
            {{ data.item.shared }}
          </p>
          <p class="mb-0">
            Balance: {{ data.item.share_password }}
          </p>
          <p class="mb-0">
            Due Date: {{ data.item.dueDate }}
          </p>
        </b-tooltip>
-->
      </template>

      <!-- Column: Client 
      <template #cell(client)="data">
        <b-media vertical-align="center">
          <template #aside>
            <b-avatar
              size="32"
              :src="data.item.avatar"
              :text="avatarText(data.item.client.name)"
              :variant="`light-${resolveClientAvatarVariant(data.item.invoiceStatus)}`"
            />
          </template>
          <span class="font-weight-bold d-block text-nowrap">
            {{ data.item.client.name }}
          </span>
          <small class="text-muted">{{ data.item.client.companyEmail }}</small>
        </b-media>
      </template>-->

      <!-- Column: Issued Date -->
      <template #cell(issuedDate)="data">
        <span class="text-nowrap">
          {{ data.value }}
        </span>
      </template>

      <!-- Column: Balance 
      <template #cell(balance)="data">
        <template v-if="data.value === 0">
          <b-badge
            pill
            variant="light-success"
          >
            Paid
          </b-badge>
        </template>
        <template v-else>
          {{ data.value }}
        </template>
      </template>-->

      <!-- Column: Actions -->
      <template #cell(actions)="data">

        <div class="text-nowrap">
          <feather-icon
            :id="`note-row-${data.item.id}-edit-icon`"
            icon="EditIcon"
            class="cursor-pointer"
            size="16"
            @click="$router.push({ name: 'apps-notes-edit', params: { id: data.item.id }})"
          />
          <!--
          <b-tooltip
            title="Edit note"
            class="cursor-pointer"
            :target="`note-row-${data.item.id}-edit-icon`"
            
          />
          -->

          <feather-icon
            :id="`note-row-${data.item.id}-trash-icon`"
            icon="TrashIcon"
            size="16"
            class="cursor-pointer mx-1"
            @click="deleteNote(data.item)"
          />
          <!-- Dropdown -->
          <b-dropdown
            variant="link"
            toggle-class="p-0"
            no-caret
            :right="$store.state.appConfig.isRTL"
          >

            <template #button-content>
              <feather-icon
                icon="MoreVerticalIcon"
                size="16"
                class="align-middle text-body"
              />
            </template>
<!--
            <b-dropdown-item>
              <feather-icon icon="DownloadIcon" />
              <span class="align-middle ml-50">Download</span>
            </b-dropdown-item>
-->
            <b-dropdown-item 
              v-if="data.item.shared == true"
              @click="doCopyNoteLink(data.item)">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Copy shared note link</span>
            </b-dropdown-item>

            <b-dropdown-item @click="doCopyNoteLink(data.item)">
              <feather-icon icon="EditIcon" />
              <span class="align-middle ml-50">Edit</span>
            </b-dropdown-item>

            <b-dropdown-item
              @click="deleteNote(data.item)">
              <feather-icon icon="TrashIcon" />
              <span class="align-middle ml-50">Delete</span>
            </b-dropdown-item>
<!--
            <b-dropdown-item>
              <feather-icon icon="CopyIcon" />
              <span class="align-middle ml-50">Duplicate</span>
            </b-dropdown-item>
-->
          </b-dropdown>
        </div>
      </template>

    </b-table>
    <div class="mx-2 mb-2">
      <b-row>

        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-start"
        >
          <span class="text-muted">Showing {{ dataMeta.from }} to {{ dataMeta.to }} of {{ dataMeta.of }} entries</span>
        </b-col>
        <!-- Pagination -->
        <b-col
          cols="12"
          sm="6"
          class="d-flex align-items-center justify-content-center justify-content-sm-end"
        >

          <b-pagination
            v-model="currentPage"
            :total-rows="totalInvoices"
            :per-page="perPage"
            first-number
            last-number
            class="mb-0 mt-1 mt-sm-0"
            prev-class="prev-item"
            next-class="next-item"
          >
            <template #prev-text>
              <feather-icon
                icon="ChevronLeftIcon"
                size="18"
              />
            </template>
            <template #next-text>
              <feather-icon
                icon="ChevronRightIcon"
                size="18"
              />
            </template>
          </b-pagination>

        </b-col>

      </b-row>
    </div>
  </b-card>

</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink,
  BBadge, BDropdown, BDropdownItem, BPagination, BTooltip,
} from 'bootstrap-vue'
import { avatarText } from '@core/utils/filter'
import vSelect from 'vue-select'
import { onUnmounted } from '@vue/composition-api'
import store from '@/store'
import useNotesList from './useNotesList'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'
import notesStoreModule from '../notesStoreModule'

export default {
  components: {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BTooltip,

    vSelect,
  },
  methods: {
    doCopyNoteLink(note) {
      this.$copyText(location.host+'/note/'+note.id).then(() => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Note link copied to clipboard',
            icon: 'BellIcon',
          },
        })
      }, () => {
        this.$toast({
          component: ToastificationContent,
          props: {
            title: 'Can not copy!',
            icon: 'BellIcon',
          },
        })
      })
    },
    deleteNote(note) {
      if (note.id) {

      this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          store
          .dispatch('app-notes/deleteNote', note.id )
          .then(response => {
            this.refetchData()
          }).then(
          this.$swal({
            icon: 'success',
            title: 'Deleted!',
            text: 'Your note has been deleted.',
            customClass: {
              confirmButton: 'btn btn-success',
            },
          })
          )
        }
      })
      }
    },
  },
  data () {
    return {
      userData: JSON.parse(localStorage.getItem('userData')),
    }
  },
  setup() {
    const NOTES_APP_STORE_MODULE_NAME = 'app-notes'

    // Register module
    if (!store.hasModule(NOTES_APP_STORE_MODULE_NAME)) store.registerModule(NOTES_APP_STORE_MODULE_NAME, notesStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(NOTES_APP_STORE_MODULE_NAME)) store.unregisterModule(NOTES_APP_STORE_MODULE_NAME)
    })

    const statusOptions = [
      'Downloaded',
      'Draft',
      'Paid',
      'Partial Payment',
      'Past Due',
    ]

    const {
      fetchNotes,
      tableColumns,
      perPage,
      currentPage,
      totalInvoices,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refNotesListTable,

      statusFilter,

      refetchData,
      resolveSharedVariant,
      // resolveInvoiceStatusVariantAndIcon,
      // resolveClientAvatarVariant,
    } = useNotesList()

    return {
      fetchNotes,
      tableColumns,
      perPage,
      currentPage,
      totalInvoices,
      dataMeta,
      perPageOptions,
      searchQuery,
      sortBy,
      isSortDirDesc,
      refNotesListTable,

      statusFilter,

      refetchData,

      statusOptions,

      avatarText,
      resolveSharedVariant,
      // resolveInvoiceStatusVariantAndIcon,
      // resolveClientAvatarVariant,
    }
  },
}
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}

.invoice-filter-select {
  min-width: 190px;

  ::v-deep .vs__selected-options {
    flex-wrap: nowrap;
  }

  ::v-deep .vs__selected {
    width: 100px;
  }
}
</style>

<style lang="scss">
  @import '@core/scss/vue/libs/vue-select.scss';
</style>
