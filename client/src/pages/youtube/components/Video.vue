<template>
  <div>
<!--    <v-container>-->
<!--      <v-row justify="space-around">-->
        <v-card width="200">
          <v-img
              height="100px"
              :src= "this.imgSrc"
          >
           <span class="my-span black white--text" style="  position: absolute;
  bottom: 4px;
  right: 4px; ">
             {{this.duration }}
            </span>
          </v-img>

          <v-card-text class=text-right>
            <div class="font-weight-bold">
              {{this.title}}
            </div>
          </v-card-text>
          <v-card-subtitle>
            views :  {{ this.id }} , {{ this.publishedAt }}
          </v-card-subtitle>
        </v-card>

<!--      </v-row>-->
<!--    </v-container>-->
    </div>
</template>

<script>
// import VideoText from "./VideoText";
export default {
name: "Video",
  components: {
    // VideoText
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
    }
  }
}
</script>

<style scoped>

</style>