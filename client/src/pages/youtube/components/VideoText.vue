<template>
  <div>
        <v-card width="200" height="100px">
          <v-card-text class=text-right>
            <div class="font-weight-bold">
              {{this.title | str_limit(18)}}
            </div>
            <div >
               views :  {{ this.views }} , {{ this.publishedAt }}
            </div>
          </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
name: "VideoText",
  components: {
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
  }
}
</script>

<style scoped>

</style>