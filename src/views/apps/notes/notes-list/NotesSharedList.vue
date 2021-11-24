<template>
  <div>

  <!-- Table Container Card -->
    <b-row>

      <b-col
        md="12"
        lg="6"
      >
      </b-col>
    </b-row>

        <!-- card 1 -->
        <b-card
          v-for="note in sharedData" :key="note.id"
          header="Shared note"
          :title="note.title"
        >
          <b-button
            variant="primary"
            :to="{ name: 'apps-note', params: { id : note.id }}"
          >
            Read note
          </b-button>
        </b-card>


</div>
</template>

<script>
import {
  BCard, BRow, BCol, BFormInput, BButton, BTable, BMedia, BAvatar, BLink,
  BBadge, BDropdown, BDropdownItem, BPagination, BTooltip,
} from 'bootstrap-vue'

import { avatarText } from '@core/utils/filter'
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
  },
  methods: {
  },
  data() {
    return {
      userData: JSON.parse(localStorage.getItem('userData')),
      sharedData : {},
      getSharedData: 
        store.dispatch('app-notes/fetchSharedNotes')
        .then(response => {
          this.sharedData = response.data
        })
    }
  },
  mounted() {
  },
  setup() {
    const NOTES_APP_STORE_MODULE_NAME = 'app-notes'

    // Register module
    if (!store.hasModule(NOTES_APP_STORE_MODULE_NAME)) store.registerModule(NOTES_APP_STORE_MODULE_NAME, notesStoreModule)

    // UnRegister on leave
    onUnmounted(() => {
      if (store.hasModule(NOTES_APP_STORE_MODULE_NAME)) store.unregisterModule(NOTES_APP_STORE_MODULE_NAME)
    })

    const {
    } = useNotesList()

    return {
    }
  },
}
</script>

<style lang="scss" scoped>
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
