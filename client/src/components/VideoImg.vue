<template>
  <div>
    <v-card :width="this.imgWidth" :height="this.imgHeight">
      <v-skeleton-loader :loading="this.youtube.mainLoader"
                         type="image"
      >
      <v-img
          :src= "this.imgSrc"
      >
         <span
             class="my-span black white--text" style="position: absolute;
         bottom: 4px;
         right: 4px;">
             {{this.duration }}
            </span>
      </v-img>
      </v-skeleton-loader>
    </v-card>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'VideoImg',
  computed: {
    ...mapState(['youtube'])
  },
  props: {
    duration: {
      type: String,
      default: ''
    },
    imgSrc: {
      type: String,
      default: ''
    },
    imgHeight: {
      type: Number,
      default: 100
    },
    imgWidth: {
      type: Number,
      default: 200
    }
  }
}
</script>

<style scoped>
</style>
