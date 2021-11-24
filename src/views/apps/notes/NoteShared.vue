<template>
  <!-- Coming soon page-->
  <div class="misc-wrapper">
    <b-link 
      class="brand-logo"
      :to="{ name: 'apps-notes'}">
      <h2 class="brand-text text-primary ml-1">
        NordNotes
      </h2>
    </b-link>

    <div class="misc-inner p-2 p-sm-3">
      <div class="w-100 text-center">
        
        <span v-if="!noteData.note">
        <h2 class="mb-1">
          You are about to see something amazing 🚀
        </h2>
        <p class="mb-3">
          But first please type secret key to unlock this note
        </p>

        <b-form
          inline
          class="row justify-content-center m-0 mb-2"
          @submit.prevent
        >
          <b-form-input
            id="secret-key"
            v-model="noteData.secret_key"
            class="col-12 col-md-5 mb-1 mr-md-2"
            type="text"
            placeholder="secret key"
          />

          <b-button
            variant="primary"
            class="mb-1 btn-sm-block"
            type="submit"
            :disabled="noteData.secret_key==''"
            @click="getNoteContent()"
          >
            Hit me!
          </b-button>
        </b-form>
        </span>
        <span else-if>
          <h2>{{ noteData.title }}</h2>
          <div v-html="noteData.note"></div>
        
          <b-button
              variant="outline-primary"
              class="mb-1 btn-sm-block"
              :to="{ name: 'apps-notes'}"
            >
            Take me to my notes
          </b-button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable global-require */
import {
  BLink, BForm, BFormInput, BButton, BImg, BCardText
} from 'bootstrap-vue'

import BCardCode from '@core/components/b-card-code/BCardCode.vue'
import VuexyLogo from '@core/layouts/components/Logo.vue'
import Ripple from 'vue-ripple-directive'
import axios from '@axios'

export default {
  components: {
    VuexyLogo,
    BLink,
    BForm,
    BButton,
    BCardText,
    BCardCode,
    BFormInput,
    BImg,
  },
  directives: {
    Ripple,
  },
  data() {
    return {
      noteData: {
        id: this.$route.path.substring(this.$route.path.lastIndexOf('/') + 1),
        secret_key: '',
        title: '',
        note: ''
      },
      downImg: require('@/assets/images/pages/coming-soon.svg'),
    }
  },
  computed: {
    imgUrl() {
      if (store.state.appConfig.layout.skin === 'dark') {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.downImg = require('@/assets/images/pages/coming-soon-dark.svg')
        return this.downImg
      }
      return this.downImg
    },
  },
  methods: {
    errorbox: function () {
      this.$swal({
        title: 'Error!',
        text: ' Wrong secret key',
        icon: 'error',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
      })
    },
    getNoteContent: function () {
      if (this.noteData.secret_key != '') {
      return new Promise((resolve, reject) => {
        axios
          .get(`/note/show/${this.noteData.id}/${this.noteData.secret_key}`)
          .then(response => {
            resolve(response)
            if (response.data.id) {
              this.noteData.title = response.data.title
              this.noteData.note = response.data.note
            }
            else
            {
              this.errorbox()
            }
            })
          .catch(error => reject(error))
      })
      }
    },
  },
}
</script>

<style lang="scss">
@import '@core/scss/vue/pages/page-misc.scss';
</style>
