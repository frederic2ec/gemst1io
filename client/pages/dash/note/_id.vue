<template>
  <v-layout justify-center align-center>
    <v-flex fill-height md12>
      <v-card height="100%">
        <v-toolbar v-for="note in notes" :key="note._id" dark color="primary">
          <v-toolbar-title>
            <v-dialog v-model="noteDialog" persistent max-width="600px">
              <template v-slot:activator="{ on }">
                <v-btn text v-on="on">{{ note.title }}</v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="headline">Edit note</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout>
                      <v-flex xs12>
                        <v-text-field
                          v-model="note.title"
                          label="Note Title"
                          required
                        ></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn text @click.stop="deleteNote">Delete</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn text @click.stop="noteDialog = false">Close</v-btn>
                  <v-btn text @click.stop="editNote">Edit</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar-title>
          <div class="flex-grow-1"></div>
          <v-btn
            text
            @click.stop="editContent"
            v-text="editing ? 'Not Saved !' : 'Saved !'"
            >Save button !</v-btn
          >
        </v-toolbar>
        <TuiEditor
          v-if="editorText.content != null"
          v-model="editorText.content"
          :options="editorOptions"
          mode="wysiwyg"
          height="88.8%"
          @change="editorChange"
        />
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex'
/* import _ from 'lodash' */
export default {
  layout: 'dashboard',
  middleware: 'auth',
  data() {
    return {
      editorOptions: {
        hideModeSwitch: true,
        usageStatistics: false
      },
      editorText: '',
      noteDialog: false,
      editing: true,
      title: ''
    }
  },
  computed: {
    ...mapGetters('notes', {
      getNoteInStore: 'find'
    }),
    notes() {
      return this.getNoteInStore({
        query: {
          _id: this.$route.params.id
        }
      }).data
    }
  },
  mounted() {
    this.authenticate().then(() => {
      this.getNote(this.$route.params.id)
        .then(result => {
          console.log(result)
          if (this.editorText._id == null) {
            this.editorText = result
            this.title = result.title
            setTimeout(() => (this.editing = false), 500)
          }
        })
        .catch(e => {
          this.setSnack({
            message: '❌ ' + e.message,
            color: 'error'
          })
          this.$router.push('/dash/')
        })
    })
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    ...mapActions('notes', { getNote: 'get' }),
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),

    editNote() {
      const { Note } = this.$FeathersVuex
      const note = new Note()
      ;(note._id = this.editorText._id),
        (note.title = this.editorText.title),
        (note.content = this.editorText.content)
      note
        .patch()
        .then(() => {
          this.setSnack({
            message: 'Note title succesfully changed 🎉 !',
            color: 'success'
          })
          this.noteDialog = false
        })
        .catch(e => {
          this.setSnack({
            message: '❌ ' + e.message,
            color: 'error'
          })
          console.log(e)
        })
    },

    deleteNote() {
      const { Note } = this.$FeathersVuex
      const note = new Note()
      note._id = this.editorText._id
      note
        .remove(this.editorText._id, { query: { cascade: true } })
        .then(() => {
          this.setSnack({
            message: 'Note succesfully deleted ❎ !',
            color: 'success'
          })
          this.noteDialog = false
          this.$router.push('/dash/notebook/' + this.editorText.notebook)
        })
        .catch(e => {
          this.setSnack({
            message: '❌ ' + e.message,
            color: 'error'
          })
          console.log(e)
        })
    },

    editorChange() {
      if (this.editorText._id != null && !this.editing) {
        this.editing = true
        /* _.debounce(this.editContent, 3000)() */
      }
    },
    editContent() {
      const { Note } = this.$FeathersVuex
      const note = new Note()
      ;(note._id = this.editorText._id),
        (note.content = this.editorText.content)
      note
        .patch()
        .then(() => {
          this.setSnack({
            message: 'Saved 🎉 !',
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
      this.editing = false
    }
  },
  head() {
    return {
      title: this.title
    }
  }
}
</script>
