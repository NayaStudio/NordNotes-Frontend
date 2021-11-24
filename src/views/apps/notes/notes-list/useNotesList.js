import { ref, watch, computed } from '@vue/composition-api'
import store from '@/store'

// Notification
import { useToast } from 'vue-toastification/composition'
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue'

export default function useNotesList() {
  // Use toast
  const toast = useToast()

  const refNotesListTable = ref(null)

  // Table Handlers
  const tableColumns = [
    { key: 'id', label: '#', sortable: true },
    { key: 'title', sortable: true },
    { key: 'shared', sortable: true },
    { key: 'actions' },
  ]
  const perPage = ref(10)
  const totalNotes = ref(0)
  const currentPage = ref(1)
  const perPageOptions = [10, 25, 50, 100]
  const searchQuery = ref('')
  const sortBy = ref('id')
  const isSortDirDesc = ref(true)
  const statusFilter = ref(null)

  const dataMeta = computed(() => {
    const localItemsCount = refNotesListTable.value ? refNotesListTable.value.localItems.length : 0
    return {
      from: perPage.value * (currentPage.value - 1) + (localItemsCount ? 1 : 0),
      to: perPage.value * (currentPage.value - 1) + localItemsCount,
      of: totalNotes.value,
    }
  })

  const refetchData = () => {
    refNotesListTable.value.refresh()
  }

  watch([currentPage, perPage, searchQuery, statusFilter], () => {
    refetchData()
  })

  const fetchNotes = (ctx, callback) => {
    store
      .dispatch('app-notes/fetchNotes', {
        user_id: JSON.parse(localStorage.getItem('userData')).id
        // q: searchQuery.value,
        // perPage: perPage.value,
        // page: currentPage.value,
        // sortBy: sortBy.value,
        // sortDesc: isSortDirDesc.value,
        // status: statusFilter.value,
      })
      .then(response => {
        // console.log(response.data)
        // const { notes, total } = response.data
        const notes = response.data
        callback(notes)
        
        // totalNotes.value = total
        totalNotes.value = notes.length
      })
      .catch(() => {
        toast({
          component: ToastificationContent,
          props: {
            title: "Error fetching notes list",
            icon: 'AlertTriangleIcon',
            variant: 'danger',
          },
        })
      })
  }

  // *===============================================---*
  // *--------- UI ---------------------------------------*
  // *===============================================---*
/*
  const resolveInvoiceStatusVariantAndIcon = status => {
    if (status === 'Partial Payment') return { variant: 'warning', icon: 'PieChartIcon' }
    if (status === 'Paid') return { variant: 'success', icon: 'CheckCircleIcon' }
    if (status === 'Downloaded') return { variant: 'info', icon: 'ArrowDownCircleIcon' }
    if (status === 'Draft') return { variant: 'primary', icon: 'SaveIcon' }
    if (status === 'Sent') return { variant: 'secondary', icon: 'SendIcon' }
    if (status === 'Past Due') return { variant: 'danger', icon: 'InfoIcon' }
    return { variant: 'secondary', icon: 'XIcon' }
  }

  const resolveClientAvatarVariant = status => {
    if (status === 'Partial Payment') return 'primary'
    if (status === 'Paid') return 'danger'
    if (status === 'Downloaded') return 'secondary'
    if (status === 'Draft') return 'warning'
    if (status === 'Sent') return 'info'
    if (status === 'Past Due') return 'success'
    return 'primary'
  }
*/

  const resolveSharedVariant = status => {
    if (status === '1') return { variant: 'success', icon: 'EyeIcon' }
    if (status === '0' || status === '') return { variant: 'primary', icon: 'EyeOffIcon' }
    return { variant: 'primary', icon: '' }
  }

  return {
    fetchNotes,
    tableColumns,
    perPage,
    currentPage,
    totalNotes,
    dataMeta,
    perPageOptions,
    searchQuery,
    sortBy,
    isSortDirDesc,
    refNotesListTable,

    statusFilter,
    resolveSharedVariant,
    // resolveInvoiceStatusVariantAndIcon,
    // resolveClientAvatarVariant,

    refetchData,
  }
}
