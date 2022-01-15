<template>
<div>
  <v-container>
    <v-row>
      <v-col cols="1">
        <v-avatar>
          <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
          >
        </v-avatar>
      </v-col>
      <v-col  cols="3" >
       <v-row >
         {{ this.channelTitle }}
       </v-row>
        <v-row>
          279K subscribers
        </v-row>
      </v-col>
      <v-col  cols="6" justify="left">

      </v-col>
    </v-row>
    <v-row>
        <p v-html="this.description">
        </p>

    </v-row>
  </v-container>
</div>
</template>

<script>
export default {
  name: 'videoDescription',
  data () {
    return {
      showMore: false,
      showMoreText: 'SHOW MORE'
    }
  },
  props: {
    channelTitle: {
      type: String,
      default: ''
    },
    description: {

    },
    publishedAt: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    showMoreClick () {
      this.showMore = !this.showMore
      this.showMoreText = this.showMore ? 'SHOW LESS' : 'SHOW MORE'
      console.log(this.showMoreText)
    }
  },
  created () {
    console.log(this.description)
  },
  computed: {
    myDescription () {
      if (this.description) {
        return this.description.replace(/(\\r)*\\n/g, '<br>')
      } else {
        return this.description
      }
    }
  }
}
</script>

<style scoped>
.no-background-hover::before {
  background-color: transparent !important;
}
</style>
