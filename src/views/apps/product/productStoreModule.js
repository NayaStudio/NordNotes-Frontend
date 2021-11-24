import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    fetchProducts(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          // .get('/apps/invoice/invoices', { params: queryParams })
          .get('http://danline/getproducts', { params: queryParams })
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    // fetchInvoice(ctx, { id }) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .get(`/apps/invoice/invoices/${id}`)
    //       .then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },
    // fetchClients() {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .get('/apps/invoice/clients')
    //       .then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },
    // addUser(ctx, userData) {
    //   return new Promise((resolve, reject) => {
    //     axios
    //       .post('/apps/user/users', { user: userData })
    //       .then(response => resolve(response))
    //       .catch(error => reject(error))
    //   })
    // },
  },
}
