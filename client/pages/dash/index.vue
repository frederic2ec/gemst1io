<template>
  <v-layout justify-center align-center>
    <v-flex md12 fill-height>
      <v-card height="97%">
        <v-toolbar dark color="primary">
          <v-toolbar-title>
            Dashboard
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-card-text scrollable>
          <v-layout row wrap>
            <v-flex v-for="notebook in notebooks" :key="notebook._id" md4 pa-2>
              <v-card @dragover="setDroppingNotebook($event, notebook)">
                <v-toolbar
                  dark
                  :color="
                    droppingNotebook == notebook ? 'green lighten-4' : 'primary'
                  "
                >
                  <v-toolbar-title>
                    <v-btn
                      text
                      @click.stop="
                        editDialog.status = true
                        editDialog.data = notebook
                      "
                    >
                      {{ notebook.title }}
                    </v-btn>
                  </v-toolbar-title>
                </v-toolbar>
                <v-list dense>
                  <v-list-item
                    v-for="note in notesByNotebookId[notebook._id]"
                    :key="note._id"
                    draggable="true"
                    @dragstart="startDraggingNote($event, note)"
                    @dragend="dropNote($event)"
                    @click="$router.push('/dash/note/' + note._id)"
                  >
                    <v-list-item-content>
                      <v-list-item-title>{{ note.title }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon>
                      <v-icon>notes</v-icon>
                    </v-list-item-icon>
                  </v-list-item>
                </v-list>
                <v-card-actions
                  ><v-btn
                    block
                    color="primary"
                    dark
                    @click.stop="
                      createDialog.status = true
                      createDialog.type = 'Note'
                      createDialog.notebook = notebook
                    "
                    ><v-icon>add</v-icon>New note</v-btn
                  ></v-card-actions
                >
              </v-card>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-dialog v-model="editDialog.status" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit notebook</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout>
              <v-flex xs12>
                <v-text-field
                  v-model="editDialog.data.title"
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
          <v-btn text @click.stop="editDialog.status = false">Close</v-btn>
          <v-btn text @click.stop="editNotebook">Edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createDialog.status" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">New note</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout>
              <v-flex xs12>
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
          <v-btn text @click.stop="createDialog.status = false">Close</v-btn>
          <v-btn text @click.stop="createNew">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions, mapMutations, mapState } from 'vuex'

export default {
  layout: 'dashboard',
  middleware: 'auth',
  data() {
    return {
      editDialog: {
        data: '',
        status: false
      },
      createDialog: {
        items: ['Notebook', 'Note'],
        status: false,
        title: '',
        type: '',
        notebook: ''
      },
      droppingNotebook: null,
      draggingNote: null
    }
  },

  computed: {
    ...mapState('auth', { user: 'payload' }),
    ...mapGetters('notebook', { findNotebookInStore: 'find' }),
    ...mapGetters('notes', { findNotesInStore: 'find' }),
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
      this.getNotebook({
        query: {
          owner: this.user.userId
        }
      }),
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
    ...mapActions('notebook', { getNotebook: 'find' }),
    ...mapActions('auth', ['authenticate']),
    ...mapActions('notes', { findNotes: 'find' }),
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    editNotebook() {
      const { Notebook } = this.$FeathersVuex
      const notebook = new Notebook()
      ;(notebook._id = this.editDialog.data._id),
        (notebook.title = this.editDialog.data.title)
      notebook
        .patch()
        .then(() => {
          this.setSnack({
            message: 'Notebook title succesfully changed 🎉 !',
            color: 'success'
          })
          this.editDialog.status = false
          this.editDialog.data = ''
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
      notebook._id = this.editDialog.data._id
      notebook
        .remove(this.editDialog.data._id, { query: { cascade: true } })
        .then(() => {
          this.setSnack({
            message: 'Notebook succesfully deleted ❎ !',
            color: 'success'
          })
          this.editDialog.status = false
          this.editDialog.data = ''
        })
        .catch(e => {
          this.setSnack({
            message: '❌ ' + e.message,
            color: 'error'
          })
          console.log(e)
        })
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
    },

    startDraggingNote(event, note) {
      this.draggingNote = note
      event.dataTransfer.setData('text/plain', note)
    },
    setDroppingNotebook(event, notebook) {
      this.droppingNotebook = notebook
    },
    async dropNote(event) {
      event.preventDefault()
      event.stopPropagation()
      if (this.droppingNotebook) {
        if (this.draggingNote.notebook !== this.droppingNotebook._id) {
          this.draggingNote.notebook = this.droppingNotebook._id
          const { Note } = this.$FeathersVuex
          const note = new Note()
          ;(note._id = this.draggingNote._id),
            (note.notebook = this.draggingNote.notebook)
          await note
            .patch()
            .then(() => {
              this.setSnack({
                message: 'Notebook change 🎉 !',
                color: 'success'
              })
            })
            .catch(e => {
              this.setSnack({
                message: '❌ ' + e.message,
                color: 'error'
              })
              console.log(e)
            })
        }
      }
      this.droppingNotebook = null
      this.draggingNote = null
    }
  },
  head() {
    return {
      title: 'Dashboard'
    }
  }
}
</script>
