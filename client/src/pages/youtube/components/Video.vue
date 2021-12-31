<template>
  <div>
    <v-container>
      <div v-if="this.vertical">
      <v-row >
         <video-img
          :duration="this.duration"
          :img-src="this.imgSrc">
          </video-img>
        </v-row>
        <v-row >
        <video-text
          :published-at="this.publishedAt"
          :title="this.title"
          :views="this.views">
          </video-text>
      </v-row>
      </div>
      <div v-else>
            <v-row >
         <video-img
          :duration="this.duration"
          :img-src="this.imgSrc">
          </video-img>
        <video-text
          :published-at="this.publishedAt"
          :title="this.title"
          :views="this.views">
          </video-text>
      </v-row>
      </div>


      
    </v-container>
    </div>
</template>

<script>
import VideoText from "./VideoText";
import VideoImg from "./VideoImg";
export default {
name: "Video",
  components: {
     VideoText,
     VideoImg
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    views: {
      type: String,
      default: '',
    },
    publishedAt: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '',
    },
    imgSrc: {
      type: String,
      default: '',
    },
    imgHeight: {
      type: Number,
      default: 100,
    },
    imgWidth: {
      type: Number,
      default: 120,
    },
    textSide: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    vertical: {
      Boolean,
      default: true
    }
  }
}
</script>

<style scoped>

</style>