<template>
  <b-table responsive="sm" :items="items"/>
</template>

<script>
import { BTable } from 'bootstrap-vue'
import productStoreModule from '../productStoreModule'
import axios from '@axios'
import Vue from 'vue'

export default {
  components: {
    BTable,
  },
  data() {
    return {
      items: [
        {
          age: 40, first_name: 'Dickerson', last_name: 'Macdonald', Occupation: 'Job',
        },
        {
          age: 21, first_name: 'Larsen', last_name: 'Shaw', Occupation: 'Job',
        },
        {
          age: 89, first_name: 'Geneva', last_name: 'Wilson', Occupation: 'Bussiness',
        },
        {
          age: 38, first_name: 'Jami', last_name: 'Carney', Occupation: 'Bussiness',
        },
        {
          age: 40, first_name: 'James', last_name: 'Thomson', Occupation: 'Job',
        },
      ],
    }
  },
  mounted() {
    axios.get('/getproducts')
      .then((response) => {
        this.items = response.data
      })
  }
}


</script>
