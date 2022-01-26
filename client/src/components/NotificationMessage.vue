<template>
    <span>
        <v-alert
            :type="notification.type"
            border="left"
            class="rounded notification"
            dark
            dismissible
            prominent
            transition="scale-transition"
        >
            <span class="mx-1">{{$t(notification.message , notification.dynamicString)}}</span>
             </v-alert>
    </span>
</template>
<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Notification',
  props: ['notification'],
  data () {
    return {
      timeout: null
    }
  },
  created () {
    this.timeout = setTimeout(() => {
      this.removeNotification(this.notification)
    }, this.notification.timeout || 4000)
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
  },
  methods: mapActions(['removeNotification']),
  computed: mapState(['notifications'])
}
</script>
<style>
.notification {
  animation: fadein 0.8s;
}

@keyframes fadein {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 0.40;
  }
  50% {
    opacity: 0.5;
  }
  75% {
    opacity: 0.75;
  }
  100% {
    opacity: 1;
  }
}
</style>
