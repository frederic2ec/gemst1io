<template>
  <v-layout justify-center align-center>
    <v-flex md12 fill-height>
      <v-card height="97%">
        <v-toolbar
          v-for="notebook in notebook"
          :key="notebook._id"
          dark
          color="primary"
        >
          <v-toolbar-title>
            <v-dialog v-model="notebookDialog" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on">{{ notebook.title }}</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Edit notebook</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout>
                      <v-flex xs12>
                        <v-text-field
                          v-model="notebookData.title"
                          label="Notebook Title"
                          required
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn text @click.stop="deleteNotebook">Delete</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn text @click.stop="notebookDialog = false">Close</v-btn>
                  <v-btn text @click.stop="editNotebook">Edit</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text scrollable>
          <v-layout row wrap>
            <v-flex v-for="note in notes" :key="note._id" md4 pa-2>
              <v-card router :to="'/dash/note/' + note._id">
                <v-toolbar dark color="primary">
                  <v-toolbar-title>
                    {{ note.title }}
                  </v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-actions> </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-dialog v-model="noteDialog" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn fab bottom right absolute color="primary" v-on="on">
              <v-icon>add</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Create new note</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout>
                  <v-flex xs12>
                    <v-text-field
                      v-model="noteTitle"
                      label="Note Title"
                      required
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click.stop="noteDialog = false">Close</v-btn>
              <v-btn text @click.stop="createNote">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  layout: 'dashboard',
  middleware: 'auth',
  data() {
    return {
      notebookData: '',
      notebookDialog: false,
      noteTitle: '',
      noteDialog: false,
      title: ''
    }
  },

  computed: {
    ...mapGetters('notebook', {
      getNotebookInStore: 'find'
    }),
    ...mapGetters('notes', {
      findNotesInStore: 'find'
    }),
    notebook() {
      return this.getNotebookInStore({
        query: {
          _id: this.$route.params.id
        }
      }).data
    },
    notes() {
      return this.findNotesInStore({
        query: {
          notebook: this.$route.params.id
        }
      }).data
    }
  },

  mounted() {
    this.authenticate().then(() => {
      this.getNotebook(this.$route.params.id).then(result => {
        this.notebookData = result
        this.title = result.title
      })
      this.findNotes({
        query: {
          notebook: this.$route.params.id,
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
    ...mapActions('notebook', { getNotebook: 'get' }),
    ...mapActions('notes', { findNotes: 'find' }),
    ...mapActions('auth', ['authenticate']),
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),

    editNotebook() {
      const { Notebook } = this.$FeathersVuex
      const notebook = new Notebook()
      ;(notebook._id = this.notebookData._id),
        (notebook.title = this.notebookData.title)
      notebook
        .patch()
        .then(() => {
          this.setSnack({
            message: 'Notebook title succesfully changed 🎉 !',
            color: 'success'
          })
          this.notebookDialog = false
        })
        .catch(e => {
          this.setSnack({
            message: '❌ ' + e.message,
            color: 'error'
          })
          console.log(e)
        })
    },

    deleteNotebook() {
      const { Notebook } = this.$FeathersVuex
      const notebook = new Notebook()
      notebook._id = this.notebookData._id
      notebook
        .remove(this.notebookData._id, { query: { cascade: true } })
        .then(() => {
          this.setSnack({
            message: 'Notebook succesfully deleted ❎ !',
            color: 'success'
          })
          this.notebookDialog = false
          this.$router.push('/dash')
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
      const { Note } = this.$FeathersVuex
      const notes = new Note()
      notes.title = this.noteTitle
      notes.content = 'Default content !'
      notes.notebook = this.$route.params.id
      notes
        .save()
        .then(r => {
          this.setSnack({
            message: 'Note created 🎉 !',
            color: 'success'
          })
          this.noteTitle = ''
          this.noteDialog = false
          this.$router.push('/dash/note/' + r._id)
        })
        .catch(e => {
          this.setSnack({
            message: '❌ ' + e.message,
            color: 'error'
          })
          console.log(e)
        })
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
