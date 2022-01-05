<template>
  <div>
    <v-container>
      <v-row>
        <div v-for=" (tag,i ) in tags.slice(1,4)" :key="i" class="blue--text">
          #{{tag}}
        </div>
      </v-row>
      <v-row>
        {{title}}
      </v-row>
      <v-row>
        {{views}} views - {{publishedAt}}
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "videoInf",
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
    tags : {
      type : Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style scoped>

</style>