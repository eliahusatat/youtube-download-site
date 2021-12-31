<template>
  <div>
        <v-card width="200">
          <v-img
              height="100px"
              :src= "this.imgSrc"
         >           
         <span 
         class="my-span black white--text" style="position: absolute;
         bottom: 4px;
         right: 4px;">
             {{this.duration }}
            </span>
          </v-img>
        </v-card>
    </div>
</template>

<script>
export default {
name: "VideoImg",
  props: {
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
    }
  }
}
</script>

<style scoped>

</style>