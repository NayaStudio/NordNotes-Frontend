// import axios from '@axios'
import axios from '@axios'

export default {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {

    fetchNotes(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        
        axios
          .get(`/notes/${queryParams.user_id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },
    
    fetchSharedNotes(ctx, queryParams) {
      return new Promise((resolve, reject) => {
        axios
          .get('/sharednotes')
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    fetchNote(ctx, { id }) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/note/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    updateNote(ctx, note) {
      return new Promise((resolve, reject) => {
            axios
              .put(`/note/update/${note.id}`, note)
              .then(response => {
                resolve(response)
                })
              .catch(error => reject(error))
          })
        },

    addNote(ctx, note) {
      return new Promise((resolve, reject) => {
        axios.get('../sanctum/csrf-cookie')
        .then(response => {
            axios
              .post(`/note/add`, note)
              .then(response => {
                resolve(response)
                })
              .catch(error => reject(error))
          })
        })
    },

    showNote(ctx, note) {
      return new Promise((resolve, reject) => {
        axios
          .get(`/note/show/${note.id}/${note.secret_key}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    },

    deleteNote(ctx, id) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`/note/${id}`)
          .then(response => resolve(response))
          .catch(error => reject(error))
      })
    }
  },
}
