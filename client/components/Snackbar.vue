<template>
  <v-snackbar v-model="show" :color="color" top right>
    {{ message }}
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: '',
      color: ''
    }
  },
  created: function() {
    this.$store.watch(
      state => state.snackbar.message,
      () => {
        const msg = this.$store.state.snackbar.message
        if (msg !== '') {
          this.show = true
          this.message = this.$store.state.snackbar.message
          this.color = this.$store.state.snackbar.color
          setTimeout(() => this.$store.commit('snackbar/setSnack', ''), 6000)
        }
      }
    )
  }
}
</script>
