import mock from '@/@fake-db/mock'
import { paginateArray, sortCompare } from '@/@fake-db/utils'

/* eslint-disable global-require */
const data = {
  notes: [
    {
      id: 4987,
      created_at: 1636499109780,
      issuedDate: '13 Dec 2019',
      title: 'Software Development',
      note: 'Amet amet elit occaecat nisi sit eiusmod occaecat irure elit dolore fugiat ipsum reprehenderit aliquip culpa velit amet consequat dolor dolore qui veniam aliquip est excepteur velit adipisicing dolor culpa consequat aliqua minim et id irure consectetur officia sit mollit cupidatat minim non eu et qui in nulla tempor qui ut adipisicing eu commodo consequat anim velit non cillum magna tempor dolore quis enim do officia et fugiat sunt eiusmod nostrud qui qui cillum ea do consectetur tempor pariatur consequat Lorem laboris cupidatat proident excepteur cupidatat anim labore excepteur laboris laborum magna culpa occaecat cillum pariatur est Lorem sit dolore.',
      avatar: '',
      invoiceStatus: 'Paid',
      dueDate: '23 Apr 2019',
    },
    {
      id: 4988,
      created_at: 1636499109780,
      issuedDate: '17 Jul 2019',
      title: 'UI/UX Design & Development',
      note: 'Adipisicing magna magna sunt pariatur minim adipisicing incididunt reprehenderit nostrud fugiat labore laboris nulla cupidatat enim laboris anim laboris duis velit amet enim amet duis ex deserunt tempor nulla et laboris aute aute quis consectetur adipisicing nulla laboris eu reprehenderit nisi magna eiusmod tempor labore fugiat deserunt cillum consequat adipisicing excepteur eu cupidatat ex et aliquip Lorem magna enim commodo officia tempor ex ipsum nisi cupidatat ipsum reprehenderit nostrud ea consectetur excepteur adipisicing esse ipsum exercitation anim dolore fugiat tempor cupidatat pariatur dolore reprehenderit exercitation magna laborum irure enim cupidatat et exercitation ad ex quis occaecat ea veniam mollit eiusmod.',
      avatar: require('@/assets/images/avatars/10-small.png'),
      invoiceStatus: 'Downloaded',
      dueDate: '15 Dec 2019',
    },
    {
      id: 4989,
      created_at: 1636499109780,
      issuedDate: '19 Oct 2019',
      title: 'Unlimited Extended License',
      note: 'Duis ut officia irure et Lorem id fugiat sunt est veniam sint aliquip sint eiusmod amet nulla elit consequat do esse laborum reprehenderit culpa minim duis aliquip ullamco deserunt excepteur dolor tempor commodo magna sunt nostrud ea pariatur laboris officia aliquip excepteur ut elit esse culpa mollit pariatur est mollit id amet aliqua velit ex aliqua laborum esse tempor non aute officia fugiat adipisicing veniam veniam dolore et ad consequat deserunt incididunt reprehenderit exercitation sint ex culpa ad Lorem sit ut esse labore est in quis sunt non do aliquip quis reprehenderit fugiat deserunt sit minim fugiat irure incididunt quis.',
      avatar: require('@/assets/images/avatars/1-small.png'),
      invoiceStatus: 'Paid',
      dueDate: '03 Nov 2019',
    },
    {
      id: 4990,
      created_at: 1636499109780,
      issuedDate: '06 Mar 2020',
      title: 'Software Development',
      note: 'Nostrud do minim laboris nisi labore eiusmod aliqua eu id velit non do nostrud tempor ullamco reprehenderit id ipsum laboris eiusmod veniam irure id duis excepteur excepteur do sit nostrud quis aliquip mollit eu laborum labore deserunt aute aliquip consectetur labore eiusmod sit proident sit ut consequat mollit laborum incididunt non qui magna sunt mollit culpa eiusmod ex et aute mollit veniam proident dolor laborum laborum ad aliqua deserunt cupidatat enim non elit enim qui laboris et dolor incididunt anim irure magna ea sunt quis enim id minim eiusmod anim aute proident tempor et reprehenderit mollit id ipsum Lorem cupidatat.',
      avatar: require('@/assets/images/avatars/9-small.png'),
      invoiceStatus: 'Sent',
      dueDate: '11 Feb 2020',
    },
    {
      id: 4991,
      created_at: 1636499109780,
      issuedDate: '08 Feb 2020',
      title: 'UI/UX Design & Development',
      note: 'Tempor eiusmod est magna tempor ullamco nulla officia veniam cillum cillum ut aute ullamco dolor officia quis nisi irure fugiat nisi velit consectetur minim consectetur dolor magna pariatur eu incididunt minim esse dolore cillum est minim sit cupidatat pariatur eu dolore amet non quis exercitation quis eu adipisicing id duis laborum pariatur anim consectetur sunt ea officia et sunt nulla incididunt cillum deserunt ad veniam ad sunt non nisi reprehenderit esse dolor deserunt mollit aliqua sit consectetur veniam irure proident velit ea culpa ut consectetur sint exercitation cillum sunt ullamco esse esse aliquip eiusmod consequat fugiat magna ut excepteur excepteur.',
      avatar: require('@/assets/images/avatars/10-small.png'),
      invoiceStatus: 'Draft',
      dueDate: '30 Jun 2019',
    }
  ],
}
/* eslint-enable */

// ------------------------------------------------
// GET: Return Users
// ------------------------------------------------
mock.onGet('/apps/notes').reply(config => {
  // eslint-disable-next-line object-curly-newline
  const { q = '', perPage = 10, page = 1, sortBy = 'id', sortDesc = false, status = null } = config.params
  /* eslint-enable */

  // const queryLowered = q.toLowerCase()
  // const filteredData = data.notes.filter(
  //   invoice =>
  //     /* eslint-disable operator-linebreak, implicit-arrow-linebreak */
  //     (invoice.client.companyEmail.toLowerCase().includes(queryLowered) ||
  //       invoice.client.name.toLowerCase().includes(queryLowered)) &&
  //     invoice.invoiceStatus === (status || invoice.invoiceStatus),
  // )
  /* eslint-enable  */

  // const sortedData = filteredData.sort(sortCompare(sortBy))
  // if (sortDesc) sortedData.reverse()

  return [
    200,
    {
      notes: paginateArray(data.notes, perPage, page),
      total: data.notes.length,
    },
  ]
})

// ------------------------------------------------
// GET: Return Single Invoice
// ------------------------------------------------
mock.onGet(/\/apps\/notes\/note\/\d+/).reply(config => {
  // Get event id from URL
  let noteId = config.url.substring(config.url.lastIndexOf('/') + 1)

  // Convert Id to number
  noteId = Number(noteId)

  const noteIndex = data.notes.findIndex(e => e.id === noteId)
  const note = data.notes[noteIndex]
  const responseData = {
    note,
    // paymentDetails: {
    //   totalDue: '$12,110.55',
    //   bankName: 'American Bank',
    //   country: 'United States',
    //   iban: 'ETD95476213874685',
    //   swiftCode: 'BR91905',
    // },
  }

  if (note) return [200, responseData]
  return [404]
})

// ------------------------------------------------
// GET: Return Clients
// ------------------------------------------------
mock.onGet('/apps/invoice/clients').reply(() => {
  const clients = data.invoices.map(invoice => invoice.client)
  return [200, clients.slice(0, 5)]
})
