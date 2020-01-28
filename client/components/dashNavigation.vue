<template>
  <div>
    <v-navigation-drawer v-model="drawer" clipped app>
      <v-list-item v-if="this.$store.state.auth.payload" two-line>
        <v-list-item-avatar v-for="profile in profile" :key="profile._id">
          <img :src="profile.pictureUrl" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>
            {{ this.$store.state.auth.payload.user.username }}

            <v-menu offset-x>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item to="/account/settings">
                  <v-list-item-content>
                    <v-list-item-title>Account settings</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider />
                <v-list-item @click.stop="logout">
                  <v-list-item-content>
                    <v-list-item-title>Logout</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider v-if="this.$store.state.auth.payload" />
      <v-list v-if="this.$store.state.auth.payload" dense nav>
        <v-list-item link router to="/dash/">
          <v-list-item-icon>
            <v-icon>dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          v-for="notebook in notebooks"
          :key="notebook._id"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-icon>
              <v-icon>{{ mdiNotebook }}</v-icon>
            </v-list-item-icon>
            <v-list-item-title v-text="notebook.title"></v-list-item-title>
          </template>
          <v-list-item
            v-for="note in notesByNotebookId[notebook._id]"
            :key="note._id"
            router
            :to="'/dash/note/' + note._id"
          >
            <v-list-item-title v-text="note.title"></v-list-item-title>
            <v-list-item-action>
              <v-icon>notes</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list-group>
      </v-list>
      <template v-if="this.$store.state.auth.payload" v-slot:append>
        <v-dialog v-model="createDialog.status" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-list dense nav>
              <v-list-item v-on="on">
                <v-list-item-icon>
                  <v-icon>{{ mdiBookPlus }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>New</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">New</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout>
                  <v-flex xs12>
                    <v-select
                      v-model="createDialog.type"
                      :items="createDialog.items"
                      label="What you want to create ?"
                      required
                    ></v-select>
                    <v-select
                      v-if="createDialog.type == 'Note'"
                      v-model="createDialog.notebook"
                      :items="notebooks"
                      item-text="title"
                      item-value="_id"
                      label="Select your notebook"
                      return-object
                      required
                    ></v-select>
                    <v-text-field
                      v-model="createDialog.title"
                      label="Title"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click.stop="createDialog.status = false"
                >Close</v-btn
              >
              <v-btn text @click.stop="createNew">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-navigation-drawer>
    <v-app-bar clipped-left fixed app>
      <v-btn icon @click.stop="drawer = !drawer">
        <v-icon>menu</v-icon>
      </v-btn>
      <v-toolbar-title>
        <router-link class="toolbar-title" to="/">
          Gemstone
        </router-link>
      </v-toolbar-title>
      <v-spacer />
    </v-app-bar>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { mdiBookPlus, mdiNotebook } from '@mdi/js'

export default {
  data() {
    return {
      drawer: true,
      pictureUrl: '',
      createDialog: {
        items: ['Notebook', 'Note'],
        status: false,
        title: '',
        type: '',
        notebook: ''
      },
      mdiBookPlus: mdiBookPlus,
      mdiNotebook: mdiNotebook
    }
  },
  computed: {
    ...mapGetters('profile', {
      findProfileInStore: 'find'
    }),
    ...mapState('auth', { user: 'payload' }),

    ...mapGetters('notebook', { findNotebookInStore: 'find' }),
    ...mapGetters('notes', { findNotesInStore: 'find' }),

    profile() {
      return this.findProfileInStore({
        query: { userId: this.$store.state.auth.payload.userId }
      }).data
    },

    notebooks() {
      return this.user
        ? this.findNotebookInStore({
            query: {
              owner: this.user.userId
            }
          }).data
        : []
    },

    notes() {
      return this.user
        ? this.findNotesInStore({
            query: {
              owner: this.user.userId
            }
          }).data
        : []
    },

    notesByNotebookId() {
      return this.notes.reduce((byId, notes) => {
        byId[notes.notebook] = byId[notes.notebook] || []
        byId[notes.notebook].push(notes)
        return byId
      }, {})
    }
  },
  mounted() {
    this.authenticate().then(() => {
      this.getProfile({
        query: {
          userId: this.$store.state.auth.payload.userId
        }
      })
      this.findNotebook({
        query: {
          owner: this.user.userId
        }
      })
      this.findNotes({
        query: {
          owner: this.user.userId,
          $select: [
            '_id',
            'notebook',
            'owner',
            'title',
            'createdAt',
            'updatedAt'
          ]
        }
      })
    })
  },
  methods: {
    ...mapActions('auth', { authLogout: 'logout' }),
    ...mapActions('profile', { getProfile: 'find' }),
    ...mapActions('notebook', { findNotebook: 'find' }),
    ...mapActions('notes', { findNotes: 'find' }),
    ...mapActions('auth', ['authenticate']),
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),

    logout() {
      this.authLogout().then(() => this.$router.push('/'))
    },

    createNotebook() {
      var payload = {
        title: this.createDialog.title
      }
      const { Notebook } = this.$FeathersVuex
      const notebook = new Notebook(payload)
      notebook
        .save()
        .then(r => {
          this.setSnack({
            message: 'Notebook created 🎉 !',
            color: 'success'
          })
          this.createDialog.title = ''
          this.createDialog.status = false
          this.createDialog.type = ''
          this.createDialog.notebook = ''
          /* this.$router.push('/dash/notebook/' + r._id) */
        })
        .catch(e => {
          this.setSnack({
            message: '❌ ' + e.message,
            color: 'error'
          })
          console.log(e)
        })
    },

    createNote() {
      var payload = {
        title: this.createDialog.title,
        notebook: this.createDialog.notebook._id,
        content: 'Default content !'
      }
      const { Note } = this.$FeathersVuex
      const note = new Note(payload)
      note
        .save()
        .then(r => {
          this.setSnack({
            message: 'Note created 🎉 !',
            color: 'success'
          })
          this.createDialog.title = ''
          this.createDialog.status = false
          this.createDialog.type = ''
          this.createDialog.notebook = ''
          this.$router.push('/dash/note/' + r._id)
        })
        .catch(e => {
          this.setSnack({
            message: '❌ ' + e.message,
            color: 'error'
          })
          console.log(e)
        })
    },

    createNew() {
      if (this.createDialog.type == 'Notebook') {
        this.createNotebook()
      } else if (this.createDialog.type == 'Note') {
        this.createNote()
      } else {
        this.setSnack({
          message: '❌ ' + 'Please select what you want to create !',
          color: 'error'
        })
      }
    }
  }
}
</script>

<style scoped>
.toolbar-title {
  color: inherit;
  text-decoration: inherit;
}
</style>
