<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8>
      <full-page id="fullpage" :options="options">
        <div class="section text-center">
          <v-col class="text-center" cols="12">
            <v-row align="center" justify="center">
              <v-img
                :src="require('../static/icon.png')"
                aspect-ratio="1"
                max-width="256"
                max-height="256"
              ></v-img>
            </v-row>
            <h1 class="display-4 mb-4 white--text">Gemstone</h1>
            <h4 class="subheading white--text">
              Privacy-focused and open source notes app.
            </h4>
            <v-btn
              depressed
              large
              class="mt-5"
              color="primary"
              router
              to="/account/register"
              >Get started</v-btn
            >
          </v-col>
        </div>
        <div class="section text-center">Two</div>
        <div class="section text-center">Three</div>
        <div class="section text-center">Four</div>
      </full-page>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  layout: 'home',
  head() {
    return {
      title: 'Home'
    }
  },
  data() {
    return {
      options: {
        licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
        scrollBar: true,
        navigation: false,
        sectionsColor: [
          '#303030',
          '#ff5f45',
          '#0798ec',
          '#fec401',
          '#1bcee6',
          '#ee1a59',
          '#2c3e4f',
          '#ba5be9',
          '#b4b8ab'
        ]
      }
    }
  }
}
</script>
