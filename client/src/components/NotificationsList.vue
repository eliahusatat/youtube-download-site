<template>
  <div :style="itemDirection" class="notifications-list">
    <notification-message
        :key="notification.id"
        :notification="notification"
        v-for="notification in notifications"
    />
  </div>
</template>

<script>
import NotificationMessage from './NotificationMessage'
import { mapState } from 'vuex'

export default {
  components: {
    NotificationMessage
  },
  computed: {
    ...mapState(['notifications']),
    itemDirection () {
      return {
        left: !this.$vuetify.rtl ? '0.5rem' : null,
        right: this.$vuetify.rtl ? '0.5rem' : null
      }
    }
  }
}
</script>

<style>
.notifications-list {
  z-index: 10005;
  position: fixed;
  bottom: 2rem;
  margin-right: 15px;
  min-width: 200px;
  max-width: 550px;
}
</style>
