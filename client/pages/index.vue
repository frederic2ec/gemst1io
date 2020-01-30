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
            <h1
              v-if="$vuetify.breakpoint.xs"
              class="mb-4 white--text display-3"
            >
              Gemstone
            </h1>
            <h1 v-else class="mb-4 white--text display-4">
              Gemstone
            </h1>
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
        <div class="section text-center">
          <v-col class="text-center" cols="12">
            <v-row align="center" justify="center">
              <v-card class="mx-auto ma-12" max-width="344" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">OVERLINE</div>
                    <v-list-item-title class="headline mb-1"
                      >Headline 5</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >Greyhound divisely hello coldly
                      fonwderfully</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-avatar
                    tile
                    size="80"
                    color="grey"
                  ></v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn text>Button</v-btn>
                  <v-btn text>Button</v-btn>
                </v-card-actions>
              </v-card>
              <v-card class="mx-auto ma-12" max-width="344" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">OVERLINE</div>
                    <v-list-item-title class="headline mb-1"
                      >Headline 5</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >Greyhound divisely hello coldly
                      fonwderfully</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-avatar
                    tile
                    size="80"
                    color="grey"
                  ></v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn text>Button</v-btn>
                  <v-btn text>Button</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
            <v-row align="center" justify="center">
              <v-card class="mx-auto ma-12" max-width="344" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">OVERLINE</div>
                    <v-list-item-title class="headline mb-1"
                      >Headline 5</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >Greyhound divisely hello coldly
                      fonwderfully</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-avatar
                    tile
                    size="80"
                    color="grey"
                  ></v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn text>Button</v-btn>
                  <v-btn text>Button</v-btn>
                </v-card-actions>
              </v-card>
              <v-card class="mx-auto ma-12" max-width="344" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="overline mb-4">OVERLINE</div>
                    <v-list-item-title class="headline mb-1"
                      >Headline 5</v-list-item-title
                    >
                    <v-list-item-subtitle
                      >Greyhound divisely hello coldly
                      fonwderfully</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-avatar
                    tile
                    size="80"
                    color="grey"
                  ></v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                  <v-btn text>Button</v-btn>
                  <v-btn text>Button</v-btn>
                </v-card-actions>
              </v-card>
            </v-row>
          </v-col>
        </div>
        <div class="section text-center">
          <v-col class="text-center" cols="12">
            <h1
              v-if="$vuetify.breakpoint.xs"
              class="mb-4 white--text display-3"
            >
              It's free !
            </h1>
            <h1 v-else class="mb-4 white--text display-4">
              It's free !
            </h1>
            <h4 class="subheading white--text">
              All the features are free and will always be !
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
      </full-page>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  layout: 'home',
  data() {
    return {
      options: {
        licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
        scrollBar: true,
        navigation: false,
        anchors: ['home', 'features', 'pricing'],
        sectionsColor: ['#303030', '#ff5f45', '#fec401']
      }
    }
  },
  mounted() {
    console.log(this.$vuetify.breakpoint)
  },
  head() {
    return {
      title: 'Home'
    }
  }
}
</script>
